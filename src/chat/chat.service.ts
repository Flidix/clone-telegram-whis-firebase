import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../user/entities/user.entity'
import { Repository } from 'typeorm'
import { CreateGroupDto } from './dto/create-group.dto'
import {ref, set, child, get, update, remove, push, } from "firebase/database";
import { SendMessageDto } from './dto/sendMEssage.dto'
import { v4 as uuidv4 } from 'uuid';
import { AddUserToGroupDto } from './dto/addUserToGroup.dto'
import { FirebaseConfig } from '../config/firebase.config'


@Injectable()
export class ChatService {
  private database;

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository :Repository<UserEntity>,
  ) {
    const app = initializeApp(FirebaseConfig);
    this.database = getDatabase(app);
  }


  async findGroupById(groupId: string) {
    const groupRef = ref(this.database, `groups/${groupId}`);
    const groupSnapshot = await get(groupRef);
    const groupData = groupSnapshot.val();


    if (groupData) {
      return groupData;
    }else {
      throw new HttpException("not found", HttpStatus.NOT_FOUND);
    }

  }

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

    // Додайте початкове повідомлення до групи
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

  async sendMessage(dto: SendMessageDto, id: number) {
    const chat = await this.findGroupById(dto.chatId);
    const user = await this.userRepository.findOneById(id);

      if (user.groups === null) {
        throw new HttpException("not found", HttpStatus.NOT_FOUND);
      }

      const guard = user.groups.find(i => i === dto.chatId)

      if (!guard){
        throw new HttpException("not found", HttpStatus.NOT_FOUND);
      }


    if (!user) {
      throw new HttpException("not found", HttpStatus.NOT_FOUND);
    }

    if (chat && Array.isArray(chat.messages)) {
      const newMessage = {
        id: uuidv4(),
        createdAt: new Date(),
        message: dto.message,
        user: user
      };

      chat.messages.push(newMessage);

      // Оновіть групу з новим повідомленням в базі даних
      const groupRef = ref(this.database, `groups/${dto.chatId}`);
      await set(groupRef, chat);

      return newMessage;
    }

    return null;
  }

  async addUserToGroup(dto: AddUserToGroupDto) {
    const chat = await this.findGroupById(dto.groupId);
    const user = await this.userRepository.findOne({ where: { id: dto.userId }, });

    if (!chat || !user) {
      throw new NotFoundException('Групу або користувача не знайдено');
    }

    // Перевірка, чи користувач вже доданий до групи
    const isUserInGroup = chat.users.some(u => u.id === user.id);
    if (isUserInGroup) {
      throw new BadRequestException('Користувач вже доданий до групи');
    }

    chat.users.push(user);
    user.groups.push(dto.groupId);

    await this.userRepository.save(user);

    // Оновіть групу з оновленими користувачами в базі даних
    const groupRef = ref(this.database, `groups/${dto.groupId}`);
    await set(groupRef, chat);

    return true;
  }
}
