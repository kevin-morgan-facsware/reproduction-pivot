
import { MikroORM } from '@mikro-orm/postgresql';
import { JSONEntity } from './entities/jsontest.entity';

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'admin',
    dbName: 'nestjsrealworld2',
    entities: [JSONEntity],
    debug: ['query', 'query-params'],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.close(true);
});

test('JSON Return Example', async () => {
  const entity = new JSONEntity();
  entity.value = "1";
  await orm.em.persistAndFlush(entity);
  // Clearing orm to ensure that the entity is not cached
  orm.em.clear();
  const result = await orm.em.findOne(JSONEntity, { id: entity.id });
  // this test case fails as "1" is not return, is.
  expect(result).not.toBeNull();
  expect(result?.value).toStrictEqual("1");
});
