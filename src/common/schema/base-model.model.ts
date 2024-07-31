import {
  Column,
  CreatedAt,
  DeletedAt,
  Index,
  Model,
  UpdatedAt,
  DataType,
  AllowNull,
} from 'sequelize-typescript';

export class BaseModel extends Model {
  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @Index
  @AllowNull
  @DeletedAt
  @Column(DataType.DATE)
  deletedAt?: Date;
}
