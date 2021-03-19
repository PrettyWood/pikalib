# variables buckets


Tool to manage hierarchical, scoped and dependent variables

Code sample:

```js

// Create a bucket with a variable 'date':
const globalBucket  = VariablesBucketCreator().set({date: '1994-07-01'})
globalBucket.state
{ isRoot: false, date: '1994-07-01' }
// NB: 'isRoot' is always present by default, and in always 'false' !


// Define variables dependant on 'date' variable:
globalBucket.set({
  year(){ return this.date.slice(0,4) },
  month(){ return this.date.slice(5,7) },
  day(){ return this.date.slice(8,10) },
})
console.log(global.state.year)
// > '1994'

// The variable can be get from the state, or directly on the object:
console.log(global.year)
'1994'

// The goal of the state is to list all available variable, without looking for there name !

// Create a child:

const instanceBucket  = VariablesBucketCreator(globalBucket)
instanceBucket.set({
  instanceName: 'toucan-instance', 
  url(){ return `http://${this.instanceName}.toucantoco.guru` }
})

// You will find in its state all variables present inside the global bucket:
console.log(instance.state)
// > { isRoot: false, date: '1994-07-01', year: '1994', month..., instanceName: 'toucan-instance', 'url': 'http://.toucantoco.guru'}

```

# TODO

- [x] dependence
- [x] heriarchy (heritage)
- [x] Error handling
- [] asynchrone handling