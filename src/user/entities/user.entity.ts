import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from '../../utils/base';
import { Exclude } from 'class-transformer'

@Entity('User')
export class UserEntity extends Base {

    @Column()
    username: string;

    @Column({ select: false })
    password: string

    @Column()
    telephoneNumber: number;

    // @Column('text', { array: true, nullable: true, select: false })
    // groups: string[];

    @Column('jsonb', { default: []})
    groups: any[];

}
