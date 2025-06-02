import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.usersService.findOne({ id: id });

      if (!user) {
        throw new Error('User not found');
      }

      // Update the user with the new data (including avatarOptions)
      const updatedUser = await this.usersService.updateOne(
        { id },
        updateUserDto,
      );

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}
