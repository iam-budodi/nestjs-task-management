import { TaskRepository } from './task.repository';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { UpdateResult } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(taskFilterDto: GetTaskFilterDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(taskFilterDto);
  }

  // getAllTasks() {
  //   return this.tasks;
  // }

  // getTasksWithFilter(getTaskFilterDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = getTaskFilterDto;
  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return tasks;
  // }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with ID: "${id}" not found.`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID: "${id}" not found.`);
    }
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
  ): Promise<UpdateResult> {
    return await this.taskRepository.update(id, { status: status });
    // const task = await this.getTaskById(id);
    // task.status = status;
    // await task.save();
    // return task;
  }
}
