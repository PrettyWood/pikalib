export class VariablesBucket {
  isRoot: boolean;
  [k: string]: any;

  constructor(isRoot: boolean) {
    this.isRoot = isRoot;
  }

  set({...args}) {
    for(const [k, v] of Object.entries(args)){
      Object.defineProperty(
        this,
        k, { get: v instanceof Function ? v.bind(this) : () => v, configurable: true }
      )
    }
    return this;
  }

  get state() {
    if(this.isRoot) return {}

    const res: Record<string, any> = {}
    for(const k of Object.getOwnPropertyNames(this)){
      try{
        res[k] = this[k] 
      } catch(error) {
        res[k] =`Error in evaluation :: ${error.message}`
      }
    }

    const parentState = Object.getPrototypeOf(this).state;
    
    return { ...parentState, ...res }
  }
};

VariablesBucket.prototype.toString = function(){
  return `VariablesBucket: ${JSON.stringify(this.state)}`
}

export const VariablesBucketCreator = (
  a: VariablesBucket = new VariablesBucket(true), 
): VariablesBucket => {
  const b = Object.create(a)
  b.set({isRoot: false})
  return b;
}
