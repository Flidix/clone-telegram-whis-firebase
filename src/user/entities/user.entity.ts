import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from '../../utils/base';
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Entity('User')
export class UserEntity extends Base {
    @ApiProperty()
    @Column()
    username: string;

    @Column({ select: false })
    @ApiProperty()
    password: string

    @Column()
    @ApiProperty()
    telephoneNumber: string;


    @Column('jsonb', { default: []})
    @ApiProperty()
    groups: any[];

}
