import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { ref, set, child, get, update, remove, push } from "firebase/database";
import { SendMessageDto } from './dto/sendMessage.dto';
import { v4 as uuidv4 } from 'uuid';
import { AddUserToGroupDto } from './dto/addUserToGroup.dto';
import { FirebaseConfig } from '../config/firebase.config';
import { DeleteUserInGroup } from './dto/deleteUserFronGroup.dto'
import { CurrentUser } from '../auth/decorators/currentUser'

@Injectable()
export class ChatService {
  private database;


  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {
    const app = initializeApp(FirebaseConfig);
    this.database = getDatabase(app);
  }

  /**
   * Find a group by its ID
   * @param groupId - ID of the group
   * @returns The group data if found, otherwise throws a NotFoundException
   */
  async findGroupById(groupId: string) {
    const groupRef = ref(this.database, `groups/${groupId}`);
    const groupSnapshot = await get(groupRef);
    const groupData = groupSnapshot.val();

    if (groupData) {
      return groupData;
    } else {
      throw new HttpException("Group not found", HttpStatus.NOT_FOUND);
    }
  }


  /**
   * Create a new group
   * @param dto - Group data
   * @param userId - ID of the user creating the group
   * @returns The created group data
   */
  async createGroup(dto: CreateGroupDto, userId: number) {
    const user = await this.userRepository.findOneById(userId);

    const groupRef = ref(this.database, 'groups');
    const newGroupRef = push(groupRef);
    const newGroupId = newGroupRef.key;

    const groupData = {
      id: newGroupId,
      name: dto.name,
      users: [],
      messages: []
    };

    groupData.users.push(user);

    // Add initial message to the group
    const initialMessage = {
      id: user.id.toString(),
      message: 'Welcome to the group!',
      user: user
    };
    groupData.messages.push(initialMessage);

    await set(child(groupRef, newGroupId), groupData);

    user.groups.push({
      id: newGroupId,
      name: groupData.name
    });
    await this.userRepository.save(user);

    return groupData;
  }

  /**
   * Send a message to a group
   * @param dto - Message data
   * @param id - ID of the user sending the message
   * @returns The sent message if successful, otherwise returns null
   */
  async sendMessage(dto: SendMessageDto, id: number) {
    const chat = await this.findGroupById(dto.chatId);
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    // Check if user is a member of the group
    if (user.groups === null || !user.groups.includes(dto.chatId)) {
      throw new HttpException("User is not a member of the group", HttpStatus.NOT_FOUND);
    }

    if (chat && Array.isArray(chat.messages)) {
      const newMessage = {
        id: uuidv4(),
        createdAt: new Date(),
        message: dto.message,
        user: user
      };

      chat.messages.push(newMessage);

      // Update the group with the new message in the database
      const groupRef = ref(this.database, `groups/${dto.chatId}`);
      await set(groupRef, chat);

      return newMessage;
    }
  }

    /**
     * Add a user to a group
     * @param dto - User and group data
     * @returns true if the user was added successfully, otherwise throws a NotFoundException or BadRequestException
     */

 async addUserToGroup(dto: AddUserToGroupDto, id: number) {


  const chat = await this.findGroupById(dto.groupId);
  const user = await this.userRepository.findOne({ where: { id: dto.userId } });

  if (!chat || !user) {
    throw new NotFoundException('Group or user not found');
  }

  const isUserInGroup = chat.users.some(u => u.id === user.id);
  if (isUserInGroup) {
    throw new BadRequestException('User is already added to the group');
  }

  chat.users.push(user);
  user.groups.push(dto.groupId);

  await this.userRepository.save(user);

  const groupRef = ref(this.database, `groups/${dto.groupId}`);
  await set(groupRef, chat);

  return true;
}

  async deleteGroup(groupId: string) {
  const groupRef = ref(this.database, `groups/${groupId}`);
    if (groupRef) {
      await remove(groupRef);
    }
  return {message: "deleted"}
  }

  async deleteUserInGroup(dto: DeleteUserInGroup) {
    const user = await this.userRepository.findOneById(dto.userId);
    const chat = await this.findGroupById(dto.chatId);

    const userIndex = chat.users.findIndex(i => i.id === dto.userId);
    const chatIndex = user.groups.findIndex(i => i.id === dto.chatId);

    if (userIndex && chatIndex) {
      chat.users.splice(userIndex, 1);
      user.groups.splice(chatIndex, 1);

      await Promise.all([
        this.userRepository.save(user),
        set(ref(this.database, `groups/${dto.chatId}`), chat)
      ]);

      return true;
    }

    return false;
  }

}

