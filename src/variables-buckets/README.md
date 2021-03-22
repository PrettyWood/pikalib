
# Vue variables buckets

A handfull renderless vue component to provide scoped bucket of variables.

These variables can:

- [x] depend on each other
- [x] inherite from a parent bucket
- [x] are scoped in there bucket
- [x] handle error
- [x] be asynchrone
- [x] be set from a bucket to an other


## Variables dependencies

Considere the following example:

```vue
<script>
import VariablesBucket from './variables-buckets/VariablesBucket';

</script>
<template>
  <div>
    My App
    <VariablesBucket>
      <MyComponent />
    </VariablesBucket>
  <div>
</template>
```

In the example above, `MyComponent1` is provided by the object
`$tcVariables` and the functions `$tcSet` and `$tcEmit`. `$tcSet` function allows you to set variable definitions in `$tcVariables`:

```js
// in `MyComponent` scipts
this.$tcSet({a:  'Hello', b(){ this.a + 'world'}})
console.log(this.$tcVariables)
// > { a:  'Hello', b: 'Hello world' }
```

`$tcEmit` is the `$tcSet` function of the parent buckets. This allows you to set variables of a bucket from it's child. Note that you cannot set from a grand-child.

- **These variables can be computed of each other, setting functions.**
- **`$tcVariables` is reactive.**


## Variables inheritance

Considere the following example:

```vue
<script>
import VariablesBucket from './variables-buckets/VariablesBucket';

</script>
<template>
  <div>
    My App
    <VariablesBucket>
      <MyParentComponent>
        <VariablesBucket>
          <MyChildComponent />
        </VariablesBucket>
      </MyParentComponent>
    </VariablesBucket>
  <div>
</template>
```

In this example, there are 2 variables buckets. The first one wraps `MyParentComponent` and the second wraps `MyChildComponent`.

In `MyParentComponent`:
```js
// mounted method of MyParentComponent:
mounted(){
  this.$tcSet({ a: 'Hello', b(){ this.a + ' from MyParentComponent' } })
  console.log(this.$tcVariables)
  // > { a: 'Hello', b: 'Hello from MyParentComponent'}
}
```

**`a` and `b` variables are inherited in `MyChildComponent`:**

```js
// mounted method of MyChildComponent:
mounted(){
  console.log(this.$tcVariables)
  // > { a: 'Hello', b: 'Hello from MyParentComponent'}
  this.$tcSet({ c(){ this.a + ' from MyChildComponent' } })
  console.log(this.$tcVariables)
  // > { a: 'Hello', b: 'Hello from MyParentComponent', c: 'Hello from MyChildComponent'}
}
```

Note that, variable `c` will not be available from the `MyParentComponent`.

If you need to set a variable `d` from the `MyParentComponent`, you should use
`$tcEmit`:

```js
// mounted method of MyChildComponent:
mounted(){
  console.log(this.$tcVariables)
  // >{ a: 'Hello', b: 'Hello from MyParentComponent'}
  this.$tcSet({ c(){ this.a + ' from MyChildComponent' } })
  this.$tcEmit({ d(){ 'Hello from MyParentComponent' } })
  console.log(this.$tcVariables)
  // > { a: 'Hello', b: 'Hello from MyParentComponent', c: 'Hello from MyChildComponent', d: 'Hello from MyParentComponent'}
}
```

## Variables are scoped

Considere the following example:

```vue
<script>
import VariablesBucket from './variables-buckets/VariablesBucket';

</script>
<template>
  <div>
    My App
    <VariablesBucket>
      <MyComponent1 />
    </VariablesBucket>
    <VariablesBucket>
      <MyComponent2 />
    </VariablesBucket>
  <div>
</template>
```

In this example, there are 2 variables buckets. The first one wraps `MyComponent1` and the second wraps `MyComponent2`.

In `MyComponent1`:
```js
// mounted method of MyComponent1:
mounted(){
  console.log(this.$tcVariables)
  // > {}
  this.$tcSet({ a: 'Hello', b(){ this.a + ' from MyComponent1' } })
  console.log(this.$tcVariables)
  // > { a: 'Hello', b: 'Hello from MyComponent1'}
}
```

The two variables buckets are independents:

In `MyComponent2`:
```js
// mounted method of MyComponent2:
mounted(){
  console.log(this.$tcVariables)
  // > {}
  this.$tcSet({ a: 'Hello', b(){ this.a + ' from MyComponent2' } })
  console.log(this.$tcVariables)
  // > { a: 'Hello', b: 'Hello from MyComponent2'}
}
```

### Making them communicate anyway

You can make the two buckets communicate by making them inherite from a parent
and emiting, new variables to the parents with `$tcEmit`

```vue
<script>
import VariablesBucket from './variables-buckets/VariablesBucket';

</script>
<template>
  <div>
    My App
    <VariablesBucket>
      <MyParentComponent>
        <VariablesBucket>
          <MyChildComponent1 />
        </VariablesBucket>
        <VariablesBucket>
          <MyChildComponent2 />
        </VariablesBucket>
      </MyParentComponent>
    </VariablesBucket>
  <div>
</template>
```

In this example, there are 3 variables buckets. The first one wraps `MyParentComponent` and the others wraps 2 child components `MyChildComponent1`.

As precised in the section "Variables scoped", `MyChildComponent1` and `MyChildComponent2`

In `MyChildComponent1`:
```js
// mounted method of MyChildComponent1:
mounted(){
  console.log(this.$tcVariables)
  // > {}
  this.$tcEmit({ c(){ this.a + ' from MyChildComponent1' } })
  console.log(this.$tcVariables)
  // > { a: 'Hello', b: 'Hello from MyParentComponent', c: 'Hello from MyChildComponent1'}
}
```

**`a` and `b` variables are inherited in `MyChildComponent2`:**

```js
// mounted method of MyChildComponent:
mounted(){
  console.log(this.$tcVariables)
  // > { a: 'Hello', b: 'Hello from MyParentComponent'}
  this.$tcSet({ c(){ this.a + ' from MyChildComponent' } })
  console.log(this.$tcVariables)
  // > { a: 'Hello', b: 'Hello from MyParentComponent', c: 'Hello from MyChildComponent'}
}
```
