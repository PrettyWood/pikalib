import { VariablesBucketCreator, VariablesBucket } from './variables-buckets';


test("VariablesBucketCreator dependencies", () => {
  // Define a global bucket and initiate a 'date' variable
  const globalBucket  = VariablesBucketCreator().set({date: '1994-07-01'})
  
  expect(globalBucket.state).toStrictEqual({
    isRoot: false,
    date: '1994-07-01'
  })

  // Define new variable base on 'date'
  globalBucket.set({
    year(){ return this.date.slice(0,4) },
    month(){ return this.date.slice(5,7) },
    day(){ return this.date.slice(8,10) },
  })

  expect(globalBucket.state.year).toBe('1994')
  expect(globalBucket.state.month).toBe('07')
  expect(globalBucket.state.day).toBe('01')

  // Define an instance bucket, child of the global bucket
  const instanceBucket  = VariablesBucketCreator(globalBucket)
  instanceBucket.set({
    instanceName: 'toucan-instance', 
    url(){ return `http://${this.instanceName}.toucantoco.guru` }
  })

  expect(instanceBucket.state).toStrictEqual({
    isRoot: false,
    date: '1994-07-01',
    year: '1994',
    month: '07',
    day: '01',
    instanceName: 'toucan-instance',
    url: 'http://toucan-instance.toucantoco.guru',
  });

  expect(globalBucket.state.instanceName).toBe(undefined)

  // Define 2 smallapps buckets:
  const smallApp1  = VariablesBucketCreator(instanceBucket)
  smallApp1.set({
    smallAppName: 'my-small-app-1', 
    url(){ return `http://${this.instanceName}.toucantoco.guru/${this.smallAppName}` },
    allowedGroup: ['Mananana', 'Plop'], // <-- specific to smallApp1
  });
  const smallApp2  = VariablesBucketCreator(instanceBucket)
  smallApp2.set({
    smallAppName: 'my-small-app-2', 
    url(){ return `http://${this.instanceName}.toucantoco.guru/${this.smallAppName}` }
  });

  /**
   * At this point we have a simple tree like
   * 
   * Global
   * |
   * Instance
   * |
   * -- smallApp1
   * |
   * -- smallApp2
   */

  expect(smallApp1.state).toStrictEqual({
    isRoot: false,
    date: '1994-07-01',
    year: '1994',
    month: '07',
    day: '01',
    instanceName: 'toucan-instance',
    smallAppName: 'my-small-app-1',
    url: 'http://toucan-instance.toucantoco.guru/my-small-app-1',
    allowedGroup: ['Mananana', 'Plop'],
  });
  expect(smallApp2.state).toStrictEqual({
    isRoot: false,
    date: '1994-07-01',
    year: '1994',
    month: '07',
    day: '01',
    instanceName: 'toucan-instance',
    smallAppName: 'my-small-app-2',
    url: 'http://toucan-instance.toucantoco.guru/my-small-app-2',
  });

  // It should not have modify the other states:
  expect(instanceBucket.state).toStrictEqual({
    isRoot: false,
    date: '1994-07-01',
    year: '1994',
    month: '07',
    day: '01',
    instanceName: 'toucan-instance',
    url: 'http://toucan-instance.toucantoco.guru',
  });
  expect(globalBucket.state).toStrictEqual({
    isRoot: false,
    date: '1994-07-01',
    year: '1994',
    month: '07',
    day: '01',
  })

  // let's redefine the smallApp name 1
  smallApp1.set({smallAppName:'smallApp-1-renamed'})
  expect(smallApp1.state.smallAppName).toBe('smallApp-1-renamed')
  // it should not have updated the brother:
  expect(smallApp2.state.smallAppName).toBe('my-small-app-2')

  // let's define a more complex object on the instance:
  instanceBucket.set({ infos: { infos1: 'jjg', infos2: 'toto', } })
  expect(instanceBucket.state).toStrictEqual({
    isRoot: false,
    date: '1994-07-01',
    year: '1994',
    month: '07',
    day: '01',
    instanceName: 'toucan-instance',
    url: 'http://toucan-instance.toucantoco.guru',
    infos: { infos1: 'jjg', infos2: 'toto', },
  });
  expect(smallApp1.state.infos).toStrictEqual({ infos1: 'jjg', infos2: 'toto', })
  expect(smallApp2.state.infos).toStrictEqual({ infos1: 'jjg', infos2: 'toto', })

  // Let's underline that the variable can be get via the state, 
  // or on the object directly:
  expect(smallApp1.infos).toStrictEqual({ infos1: 'jjg', infos2: 'toto', })
  expect(smallApp2.infos).toStrictEqual({ infos1: 'jjg', infos2: 'toto', })
  expect(smallApp2.date).toStrictEqual('1994-07-01')
});