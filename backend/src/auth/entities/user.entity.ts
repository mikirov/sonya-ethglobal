import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  CreateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs'; // or 'bcryptjs'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsEthereumAddress,
  IsString,
  MinLength,
} from 'class-validator';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the user' })
  id: string;

  @Column({ unique: true, nullable: true })
  @ApiProperty({ description: 'Email address of the user', uniqueItems: true })
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Password for the user account' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Column({ default: false })
  @ApiProperty({
    description: 'Whether the user account is active or not',
    default: false,
  })
  isActive: boolean;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: 'Ethereum wallet address associated with the user',
  })
  @IsOptional()
  @IsEthereumAddress({ message: 'Invalid Ethereum wallet address' })
  web3Address?: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'The date the user was created' })
  createdAt: Date;

  private tempPassword: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.tempPassword !== this.password) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  async comparePassword(enteredPassword: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await bcrypt.compare(enteredPassword, this.password);
  }
}
