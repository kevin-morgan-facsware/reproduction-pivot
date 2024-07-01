import { AccountUser } from './entities/account-user.entity';
import { Account } from './entities/account.entity';
import { Project } from './entities/project.entity';
import { User } from './entities/user.entity';
import { Document } from './entities/document.entity';
import { MikroORM } from '@mikro-orm/sqlite';


let orm: MikroORM;
beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: ':memory:',
    entities: [User, Account, AccountUser, Project, Document],
    debug: ['query', 'query-params'],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refreshDatabase();
});


afterAll(async () => {
  await orm.close(true);
});

test('basic CRUD example', async () => {

  // Doing this in a pattern to simulate our api calls
  // Create a new account and a user that belongs to account 
  // This is a many to many relationship as a user can belong to multiple accounts
  const account = new Account();
  const user = new User();
  user.email = 'test123abc@mailinator.com';
  account.users.add(user);
  await orm.em.persistAndFlush(account);



  // Create a quick sample project and assign the user to it
  const project1 = new Project();
  project1.name = 'My First Project';
  const foundUser = await orm.em.findOneOrFail(User, {
    email: 'test123abc@mailinator.com',
  });
  const accountUser = await orm.em.findOne(AccountUser, {
    user: foundUser,
  });
  if(!accountUser){
    return;
  }
  project1.assignedUsers.add(accountUser);
  await orm.em.persistAndFlush(project1);

  // This breads below, refetching the user to simulate this being a new request 
  // and even clearing the cache 
  orm.em.clear();
  const document = new Document();
  const document1 = new Document();
  document.account = account;
  document1.account = account;
  const project = await orm.em.findOne(Project, {
    name: 'My First Project',
  });
  if(!project){
    return;
  }
  const broken_user = await orm.em.findOneOrFail(User, {
    email: 'test123abc@mailinator.com',
  });
  const broken_account_user = await orm.em.findOne(
    AccountUser,
    {
      user: broken_user,
    },
    {
      // Spefically populating the relation causes this blow up of "assigned Projects"
      populate: ['assignedProjects', 'assignedDocuments'],
    },
  );
  if(!broken_account_user){
    return;
  }
  document.assignee = broken_account_user;
  document1.assignee = broken_account_user;
  project.documents.add(document);
  project.documents.add(document1);
  await orm.em.persistAndFlush(project);
});
