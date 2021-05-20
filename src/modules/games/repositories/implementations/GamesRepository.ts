import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games =  await this.repository
      .createQueryBuilder('game')
      .select('game.title')
      .where('LOWER(game.title) LIKE LOWER(:title)', {title: `%${param}%`})
      .getMany()
    return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`SELECT COUNT(id) FROM games`); 
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const games = await this.repository
    .createQueryBuilder('game')
    .innerJoinAndSelect('game.users', 'user')
    .where("game.id = :gameId", { gameId: id })
    .getOne();

    return games?.users || []

  }
}
