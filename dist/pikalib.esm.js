import Vue from 'vue';

var toString = function (x) { return Object.prototype.toString.call(x); };
function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}
var hasSymbol = typeof Symbol !== 'undefined' &&
    isNative(Symbol) &&
    typeof Reflect !== 'undefined' &&
    isNative(Reflect.ownKeys);
var noopFn = function (_) { return _; };
var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noopFn,
    set: noopFn,
};
function proxy(target, key, _a) {
    var get = _a.get, set = _a.set;
    sharedPropertyDefinition.get = get || noopFn;
    sharedPropertyDefinition.set = set || noopFn;
    Object.defineProperty(target, key, sharedPropertyDefinition);
}
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true,
    });
}
function hasOwn(obj, key) {
    return Object.hasOwnProperty.call(obj, key);
}
function assert(condition, msg) {
    if (!condition)
        throw new Error("[vue-composition-api] " + msg);
}
function isArray(x) {
    return Array.isArray(x);
}
function isObject(val) {
    return val !== null && typeof val === 'object';
}
function isPlainObject(x) {
    return toString(x) === '[object Object]';
}
function isFunction(x) {
    return typeof x === 'function';
}
function warn(msg, vm) {
    Vue.util.warn(msg, vm);
}

var vueDependency = undefined;
try {
    var requiredVue = require('vue');
    if (requiredVue && isVue(requiredVue)) {
        vueDependency = requiredVue;
    }
    else if (requiredVue &&
        'default' in requiredVue &&
        isVue(requiredVue.default)) {
        vueDependency = requiredVue.default;
    }
}
catch (_a) {
    // not available
}
var vueConstructor = null;
var currentInstance = null;
var PluginInstalledFlag = '__composition_api_installed__';
function isVue(obj) {
    return obj && typeof obj === 'function' && obj.name === 'Vue';
}
function isVueRegistered(Vue) {
    return hasOwn(Vue, PluginInstalledFlag);
}
function getVueConstructor() {
    if ((process.env.NODE_ENV !== 'production')) {
        assert(vueConstructor, "must call Vue.use(VueCompositionAPI) before using any function.");
    }
    return vueConstructor;
}
// returns registered vue or `vue` dependency
function getRegisteredVueOrDefault() {
    var constructor = vueConstructor || vueDependency;
    if ((process.env.NODE_ENV !== 'production')) {
        assert(constructor, "No vue dependency found.");
    }
    return constructor;
}
function setVueConstructor(Vue) {
    // @ts-ignore
    if ((process.env.NODE_ENV !== 'production') && vueConstructor && Vue.__proto__ !== vueConstructor.__proto__) {
        warn('Another instance of vue installed');
    }
    vueConstructor = Vue;
    Object.defineProperty(Vue, PluginInstalledFlag, {
        configurable: true,
        writable: true,
        value: true,
    });
}
function setCurrentInstance(vm) {
    // currentInstance?.$scopedSlots
    currentInstance = vm;
}
function getCurrentVue2Instance() {
    return currentInstance;
}
function getCurrentInstance() {
    if (currentInstance) {
        return toVue3ComponentInstance(currentInstance);
    }
    return null;
}
var instanceMapCache = new WeakMap();
function toVue3ComponentInstance(vue2Instance) {
    if (instanceMapCache.has(vue2Instance)) {
        return instanceMapCache.get(vue2Instance);
    }
    var instance = {
        proxy: vue2Instance,
        update: vue2Instance.$forceUpdate,
        uid: vue2Instance._uid,
        // $emit is defined on prototype and it expected to be bound
        emit: vue2Instance.$emit.bind(vue2Instance),
        parent: null,
        root: null,
    };
    // map vm.$props =
    var instanceProps = [
        'data',
        'props',
        'attrs',
        'refs',
        'vnode',
        'slots',
    ];
    instanceProps.forEach(function (prop) {
        proxy(instance, prop, {
            get: function () {
                return vue2Instance["$" + prop];
            },
        });
    });
    proxy(instance, 'isMounted', {
        get: function () {
            // @ts-expect-error private api
            return vue2Instance._isMounted;
        },
    });
    proxy(instance, 'isUnmounted', {
        get: function () {
            // @ts-expect-error private api
            return vue2Instance._isDestroyed;
        },
    });
    proxy(instance, 'isDeactivated', {
        get: function () {
            // @ts-expect-error private api
            return vue2Instance._inactive;
        },
    });
    proxy(instance, 'emitted', {
        get: function () {
            // @ts-expect-error private api
            return vue2Instance._events;
        },
    });
    instanceMapCache.set(vue2Instance, instance);
    if (vue2Instance.$parent) {
        instance.parent = toVue3ComponentInstance(vue2Instance.$parent);
    }
    if (vue2Instance.$root) {
        instance.root = toVue3ComponentInstance(vue2Instance.$root);
    }
    return instance;
}
function defineComponentInstance(Ctor, options) {
    if (options === void 0) { options = {}; }
    var silent = Ctor.config.silent;
    Ctor.config.silent = true;
    var vm = new Ctor(options);
    Ctor.config.silent = silent;
    return vm;
}
function isComponentInstance(obj) {
    var Vue = getVueConstructor();
    return Vue && obj instanceof Vue;
}
function createSlotProxy(vm, slotName) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!vm.$scopedSlots[slotName]) {
            return warn("slots." + slotName + "() got called outside of the \"render()\" scope", vm);
        }
        return vm.$scopedSlots[slotName].apply(vm, args);
    };
}
function resolveSlots(slots, normalSlots) {
    var res;
    if (!slots) {
        res = {};
    }
    else if (slots._normalized) {
        // fast path 1: child component re-render only, parent did not change
        return slots._normalized;
    }
    else {
        res = {};
        for (var key in slots) {
            if (slots[key] && key[0] !== '$') {
                res[key] = true;
            }
        }
    }
    // expose normal slots on scopedSlots
    for (var key in normalSlots) {
        if (!(key in res)) {
            res[key] = true;
        }
    }
    return res;
}
var vueInternalClasses;
var getVueInternalClasses = function () {
    if (!vueInternalClasses) {
        var vm = defineComponentInstance(getVueConstructor(), {
            computed: {
                value: function () {
                    return 0;
                },
            },
        });
        // to get Watcher class
        var Watcher = vm._computedWatchers.value.constructor;
        // to get Dep class
        var Dep = vm._data.__ob__.dep.constructor;
        vueInternalClasses = {
            Watcher: Watcher,
            Dep: Dep,
        };
        vm.$destroy();
    }
    return vueInternalClasses;
};

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
// must be a string, symbol key is ignored in reactive
var RefKey = 'composition-api.refKey';

var accessModifiedSet = new WeakMap();
var readonlySet = new WeakMap();

var RefImpl = /** @class */ (function () {
    function RefImpl(_a) {
        var get = _a.get, set = _a.set;
        proxy(this, 'value', {
            get: get,
            set: set,
        });
    }
    return RefImpl;
}());
function createRef(options, readonly) {
    var r = new RefImpl(options);
    // seal the ref, this could prevent ref from being observed
    // It's safe to seal the ref, since we really shouldn't extend it.
    // related issues: #79
    var sealed = Object.seal(r);
    readonlySet.set(sealed, true);
    return sealed;
}
function ref(raw) {
    var _a;
    if (isRef(raw)) {
        return raw;
    }
    var value = reactive((_a = {}, _a[RefKey] = raw, _a));
    return createRef({
        get: function () { return value[RefKey]; },
        set: function (v) { return (value[RefKey] = v); },
    });
}
function isRef(value) {
    return value instanceof RefImpl;
}
function toRefs(obj) {
    if ((process.env.NODE_ENV !== 'production') && !isReactive(obj)) {
        warn("toRefs() expects a reactive object but received a plain one.");
    }
    if (!isPlainObject(obj))
        return obj;
    var ret = {};
    for (var key in obj) {
        ret[key] = toRef(obj, key);
    }
    return ret;
}
function toRef(object, key) {
    var v = object[key];
    if (isRef(v))
        return v;
    return createRef({
        get: function () { return object[key]; },
        set: function (v) { return (object[key] = v); },
    });
}

function isRaw(obj) {
    var _a;
    return Boolean((obj === null || obj === void 0 ? void 0 : obj.__ob__) && ((_a = obj.__ob__) === null || _a === void 0 ? void 0 : _a.__raw__));
}
function isReactive(obj) {
    var _a;
    return Boolean((obj === null || obj === void 0 ? void 0 : obj.__ob__) && !((_a = obj.__ob__) === null || _a === void 0 ? void 0 : _a.__raw__));
}
/**
 * Proxing property access of target.
 * We can do unwrapping and other things here.
 */
function setupAccessControl(target) {
    if (!isPlainObject(target) ||
        isRaw(target) ||
        Array.isArray(target) ||
        isRef(target) ||
        isComponentInstance(target) ||
        accessModifiedSet.has(target))
        return;
    accessModifiedSet.set(target, true);
    var keys = Object.keys(target);
    for (var i = 0; i < keys.length; i++) {
        defineAccessControl(target, keys[i]);
    }
}
/**
 * Auto unwrapping when access property
 */
function defineAccessControl(target, key, val) {
    if (key === '__ob__')
        return;
    if (isRaw(target[key]))
        return;
    var getter;
    var setter;
    var property = Object.getOwnPropertyDescriptor(target, key);
    if (property) {
        if (property.configurable === false) {
            return;
        }
        getter = property.get;
        setter = property.set;
        if ((!getter || setter) /* not only have getter */ &&
            arguments.length === 2) {
            val = target[key];
        }
    }
    setupAccessControl(val);
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get: function getterHandler() {
            var value = getter ? getter.call(target) : val;
            // if the key is equal to RefKey, skip the unwrap logic
            if (key !== RefKey && isRef(value)) {
                return value.value;
            }
            else {
                return value;
            }
        },
        set: function setterHandler(newVal) {
            if (getter && !setter)
                return;
            var value = getter ? getter.call(target) : val;
            // If the key is equal to RefKey, skip the unwrap logic
            // If and only if "value" is ref and "newVal" is not a ref,
            // the assignment should be proxied to "value" ref.
            if (key !== RefKey && isRef(value) && !isRef(newVal)) {
                value.value = newVal;
            }
            else if (setter) {
                setter.call(target, newVal);
            }
            else {
                val = newVal;
            }
            setupAccessControl(newVal);
        },
    });
}
function observe(obj) {
    var Vue = getRegisteredVueOrDefault();
    var observed;
    if (Vue.observable) {
        observed = Vue.observable(obj);
    }
    else {
        var vm = defineComponentInstance(Vue, {
            data: {
                $$state: obj,
            },
        });
        observed = vm._data.$$state;
    }
    // in SSR, there is no __ob__. Mock for reactivity check
    if (!hasOwn(observed, '__ob__')) {
        def(observed, '__ob__', mockObserver(observed));
    }
    return observed;
}
function createObserver() {
    return observe({}).__ob__;
}
function mockObserver(value) {
    if (value === void 0) { value = {}; }
    return {
        value: value,
        dep: {
            notify: noopFn,
            depend: noopFn,
            addSub: noopFn,
            removeSub: noopFn,
        },
    };
}
/**
 * Make obj reactivity
 */
function reactive(obj) {
    if ((process.env.NODE_ENV !== 'production') && !obj) {
        warn('"reactive()" is called without provide an "object".');
        // @ts-ignore
        return;
    }
    if (!(isPlainObject(obj) || isArray(obj)) ||
        isRaw(obj) ||
        !Object.isExtensible(obj)) {
        return obj;
    }
    var observed = observe(obj);
    setupAccessControl(observed);
    return observed;
}

// implement
function computed(options) {
    var _a;
    var vm = (_a = getCurrentInstance()) === null || _a === void 0 ? void 0 : _a.proxy;
    var get, set;
    if (typeof options === 'function') {
        get = options;
    }
    else {
        get = options.get;
        set = options.set;
    }
    var computedSetter;
    var computedGetter;
    if (vm && !vm.$isServer) {
        var _b = getVueInternalClasses(), Watcher_1 = _b.Watcher, Dep_1 = _b.Dep;
        var watcher_1;
        computedGetter = function () {
            if (!watcher_1) {
                watcher_1 = new Watcher_1(vm, get, noopFn, { lazy: true });
            }
            if (watcher_1.dirty) {
                watcher_1.evaluate();
            }
            if (Dep_1.target) {
                watcher_1.depend();
            }
            return watcher_1.value;
        };
        computedSetter = function (v) {
            if ((process.env.NODE_ENV !== 'production') && !set) {
                warn('Write operation failed: computed value is readonly.', vm);
                return;
            }
            if (set) {
                set(v);
            }
        };
    }
    else {
        // fallback
        var computedHost_1 = defineComponentInstance(getVueConstructor(), {
            computed: {
                $$state: {
                    get: get,
                    set: set,
                },
            },
        });
        vm && vm.$on('hook:destroyed', function () { return computedHost_1.$destroy(); });
        computedGetter = function () { return computedHost_1.$$state; };
        computedSetter = function (v) {
            if ((process.env.NODE_ENV !== 'production') && !set) {
                warn('Write operation failed: computed value is readonly.', vm);
                return;
            }
            computedHost_1.$$state = v;
        };
    }
    return createRef({
        get: computedGetter,
        set: computedSetter,
    });
}

var EMPTY_OBJ = (process.env.NODE_ENV !== 'production')
    ? Object.freeze({})
    : {};

function set$1(vm, key, value) {
    var state = (vm.__composition_api_state__ =
        vm.__composition_api_state__ || {});
    state[key] = value;
}
function get(vm, key) {
    return (vm.__composition_api_state__ || {})[key];
}
var vmStateManager = {
    set: set$1,
    get: get,
};

function asVmProperty(vm, propName, propValue) {
    var props = vm.$options.props;
    if (!(propName in vm) && !(props && hasOwn(props, propName))) {
        if (isRef(propValue)) {
            proxy(vm, propName, {
                get: function () { return propValue.value; },
                set: function (val) {
                    propValue.value = val;
                },
            });
        }
        else {
            // @ts-ignore
            vm[propName] = propValue;
        }
        if ((process.env.NODE_ENV !== 'production')) {
            // expose binding to Vue Devtool as a data property
            // delay this until state has been resolved to prevent repeated works
            vm.$nextTick(function () {
                if (isRef(propValue)) {
                    proxy(vm._data, propName, {
                        get: function () { return propValue.value; },
                        set: function (val) {
                            propValue.value = val;
                        },
                    });
                }
                else {
                    vm._data[propName] = propValue;
                }
            });
        }
    }
    else if ((process.env.NODE_ENV !== 'production')) {
        if (props && hasOwn(props, propName)) {
            warn("The setup binding property \"" + propName + "\" is already declared as a prop.", vm);
        }
        else {
            warn("The setup binding property \"" + propName + "\" is already declared.", vm);
        }
    }
}
function updateTemplateRef(vm) {
    var rawBindings = vmStateManager.get(vm, 'rawBindings') || {};
    if (!rawBindings || !Object.keys(rawBindings).length)
        return;
    var refs = vm.$refs;
    var oldRefKeys = vmStateManager.get(vm, 'refs') || [];
    for (var index = 0; index < oldRefKeys.length; index++) {
        var key = oldRefKeys[index];
        var setupValue = rawBindings[key];
        if (!refs[key] && setupValue && isRef(setupValue)) {
            setupValue.value = null;
        }
    }
    var newKeys = Object.keys(refs);
    var validNewKeys = [];
    for (var index = 0; index < newKeys.length; index++) {
        var key = newKeys[index];
        var setupValue = rawBindings[key];
        if (refs[key] && setupValue && isRef(setupValue)) {
            setupValue.value = refs[key];
            validNewKeys.push(key);
        }
    }
    vmStateManager.set(vm, 'refs', validNewKeys);
}
function resolveScopedSlots(vm, slotsProxy) {
    var parentVNode = vm.$options._parentVnode;
    if (!parentVNode)
        return;
    var prevSlots = vmStateManager.get(vm, 'slots') || [];
    var curSlots = resolveSlots(parentVNode.data.scopedSlots, vm.$slots);
    // remove staled slots
    for (var index = 0; index < prevSlots.length; index++) {
        var key = prevSlots[index];
        if (!curSlots[key]) {
            delete slotsProxy[key];
        }
    }
    // proxy fresh slots
    var slotNames = Object.keys(curSlots);
    for (var index = 0; index < slotNames.length; index++) {
        var key = slotNames[index];
        if (!slotsProxy[key]) {
            slotsProxy[key] = createSlotProxy(vm, key);
        }
    }
    vmStateManager.set(vm, 'slots', slotNames);
}
function activateCurrentInstance(vm, fn, onError) {
    var preVm = getCurrentVue2Instance();
    setCurrentInstance(vm);
    try {
        return fn(vm);
    }
    catch (err) {
        if (onError) {
            onError(err);
        }
        else {
            throw err;
        }
    }
    finally {
        setCurrentInstance(preVm);
    }
}

function mixin(Vue) {
    Vue.mixin({
        beforeCreate: functionApiInit,
        mounted: function () {
            updateTemplateRef(this);
        },
        updated: function () {
            updateTemplateRef(this);
        },
    });
    /**
     * Vuex init hook, injected into each instances init hooks list.
     */
    function functionApiInit() {
        var vm = this;
        var $options = vm.$options;
        var setup = $options.setup, render = $options.render;
        if (render) {
            // keep currentInstance accessible for createElement
            $options.render = function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return activateCurrentInstance(vm, function () { return render.apply(_this, args); });
            };
        }
        if (!setup) {
            return;
        }
        if (typeof setup !== 'function') {
            if ((process.env.NODE_ENV !== 'production')) {
                warn('The "setup" option should be a function that returns a object in component definitions.', vm);
            }
            return;
        }
        var data = $options.data;
        // wrapper the data option, so we can invoke setup before data get resolved
        $options.data = function wrappedData() {
            initSetup(vm, vm.$props);
            return typeof data === 'function'
                ? data.call(vm, vm)
                : data || {};
        };
    }
    function initSetup(vm, props) {
        if (props === void 0) { props = {}; }
        var setup = vm.$options.setup;
        var ctx = createSetupContext(vm);
        // fake reactive for `toRefs(props)`
        def(props, '__ob__', createObserver());
        // resolve scopedSlots and slots to functions
        // @ts-expect-error
        resolveScopedSlots(vm, ctx.slots);
        var binding;
        activateCurrentInstance(vm, function () {
            // make props to be fake reactive, this is for `toRefs(props)`
            binding = setup(props, ctx);
        });
        if (!binding)
            return;
        if (isFunction(binding)) {
            // keep typescript happy with the binding type.
            var bindingFunc_1 = binding;
            // keep currentInstance accessible for createElement
            vm.$options.render = function () {
                // @ts-expect-error
                resolveScopedSlots(vm, ctx.slots);
                return activateCurrentInstance(vm, function () { return bindingFunc_1(); });
            };
            return;
        }
        else if (isPlainObject(binding)) {
            if (isReactive(binding)) {
                binding = toRefs(binding);
            }
            vmStateManager.set(vm, 'rawBindings', binding);
            var bindingObj_1 = binding;
            Object.keys(bindingObj_1).forEach(function (name) {
                var bindingValue = bindingObj_1[name];
                if (!isRef(bindingValue)) {
                    if (!isReactive(bindingValue)) {
                        if (isFunction(bindingValue)) {
                            bindingValue = bindingValue.bind(vm);
                        }
                        else if (!isObject(bindingValue)) {
                            bindingValue = ref(bindingValue);
                        }
                        else if (hasReactiveArrayChild(bindingValue)) {
                            // creates a custom reactive properties without make the object explicitly reactive
                            // NOTE we should try to avoid this, better implementation needed
                            customReactive(bindingValue);
                        }
                    }
                    else if (isArray(bindingValue)) {
                        bindingValue = ref(bindingValue);
                    }
                }
                asVmProperty(vm, name, bindingValue);
            });
            return;
        }
        if ((process.env.NODE_ENV !== 'production')) {
            assert(false, "\"setup\" must return a \"Object\" or a \"Function\", got \"" + Object.prototype.toString
                .call(binding)
                .slice(8, -1) + "\"");
        }
    }
    function customReactive(target) {
        if (!isPlainObject(target) ||
            isRef(target) ||
            isReactive(target) ||
            isRaw(target))
            return;
        var Vue = getVueConstructor();
        var defineReactive = Vue.util.defineReactive;
        Object.keys(target).forEach(function (k) {
            var val = target[k];
            defineReactive(target, k, val);
            if (val) {
                customReactive(val);
            }
            return;
        });
    }
    function hasReactiveArrayChild(target, visited) {
        if (visited === void 0) { visited = new Map(); }
        if (visited.has(target)) {
            return visited.get(target);
        }
        visited.set(target, false);
        if (Array.isArray(target) && isReactive(target)) {
            visited.set(target, true);
            return true;
        }
        if (!isPlainObject(target) || isRaw(target)) {
            return false;
        }
        return Object.keys(target).some(function (x) {
            return hasReactiveArrayChild(target[x], visited);
        });
    }
    function createSetupContext(vm) {
        var ctx = { slots: {} };
        var propsPlain = [
            'root',
            'parent',
            'refs',
            'listeners',
            'isServer',
            'ssrContext',
        ];
        var propsReactiveProxy = ['attrs'];
        var methodReturnVoid = ['emit'];
        propsPlain.forEach(function (key) {
            var srcKey = "$" + key;
            proxy(ctx, key, {
                get: function () { return vm[srcKey]; },
                set: function () {
                    warn("Cannot assign to '" + key + "' because it is a read-only property", vm);
                },
            });
        });
        propsReactiveProxy.forEach(function (key) {
            var srcKey = "$" + key;
            proxy(ctx, key, {
                get: function () {
                    var e_1, _a;
                    var data = reactive({});
                    var source = vm[srcKey];
                    var _loop_1 = function (attr) {
                        proxy(data, attr, {
                            get: function () {
                                // to ensure it always return the latest value
                                return vm[srcKey][attr];
                            },
                        });
                    };
                    try {
                        for (var _b = __values(Object.keys(source)), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var attr = _c.value;
                            _loop_1(attr);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    return data;
                },
                set: function () {
                    warn("Cannot assign to '" + key + "' because it is a read-only property", vm);
                },
            });
        });
        methodReturnVoid.forEach(function (key) {
            var srcKey = "$" + key;
            proxy(ctx, key, {
                get: function () {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var fn = vm[srcKey];
                        fn.apply(vm, args);
                    };
                },
            });
        });
        if (process.env.NODE_ENV === 'test') {
            ctx._vm = vm;
        }
        return ctx;
    }
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(from, to) {
    if (!from)
        return to;
    if (!to)
        return from;
    var key;
    var toVal;
    var fromVal;
    var keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);
    for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        // in case the object is already observed...
        if (key === '__ob__')
            continue;
        toVal = to[key];
        fromVal = from[key];
        if (!hasOwn(to, key)) {
            to[key] = fromVal;
        }
        else if (toVal !== fromVal &&
            isPlainObject(toVal) &&
            !isRef(toVal) &&
            isPlainObject(fromVal) &&
            !isRef(fromVal)) {
            mergeData(fromVal, toVal);
        }
    }
    return to;
}
function install(Vue) {
    if (isVueRegistered(Vue)) {
        if ((process.env.NODE_ENV !== 'production')) {
            assert(false, 'already installed. Vue.use(VueCompositionAPI) should be called only once.');
        }
        return;
    }
    if ((process.env.NODE_ENV !== 'production')) {
        if (Vue.version) {
            if (Vue.version[0] !== '2' || Vue.version[1] !== '.') {
                assert(false, "only works with Vue 2, v" + Vue.version + " found.");
            }
        }
        else {
            warn('Vue version not found');
        }
    }
    Vue.config.optionMergeStrategies.setup = function (parent, child) {
        return function mergedSetupFn(props, context) {
            return mergeData(typeof parent === 'function' ? parent(props, context) || {} : undefined, typeof child === 'function' ? child(props, context) || {} : undefined);
        };
    };
    setVueConstructor(Vue);
    mixin(Vue);
}
var Plugin = {
    install: function (Vue) { return install(Vue); },
};

// implementation, close to no-op
function defineComponent(options) {
    return options;
}
// auto install when using CDN
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Plugin);
}

var script = defineComponent({
    props: {
        name: {
            type: String,
            required: true,
        },
        hp: {
            type: Number,
            default: 100,
            validator: (hp) => 0 <= hp && hp <= 100,
        }
    },
    setup(props) {
        return {
            state: computed(() => props.hp > 0 ? "alive" : "dead")
        };
    }
});

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "pokemon", class: "pokemon--" + _vm.state }, [
    _c("h1", [
      _vm._v(
        "Pokemon " + _vm._s(_vm.name) + " (HP: " + _vm._s(_vm.hp) + "/100)"
      )
    ])
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-4a587c12_0", { source: "\n.pokemon {\n  font-size: 30px;\n}\n.pokemon--alive {\n  color: green;\n}\n.pokemon--dead {\n  color: darkred;\n}\n", map: {"version":3,"sources":["/Users/ericjolibois/projects/pikalib/src/components/Pokemon.vue"],"names":[],"mappings":";AAmCA;EACA,eAAA;AACA;AAEA;EACA,YAAA;AACA;AAEA;EACA,cAAA;AACA","file":"Pokemon.vue","sourcesContent":["<script lang=\"ts\">\nimport { computed, defineComponent } from \"@vue/composition-api\"\n\nexport interface PokemonProps {\n  name: string;\n  hp: number;\n}\n\nexport default defineComponent({\n  props: {\n    name: {\n      type: String,\n      required: true,\n    },\n    hp: {\n      type: Number,\n      default: 100,\n      validator: (hp: number) => 0 <= hp && hp <= 100,\n    }\n  },\n  setup(props: PokemonProps) {\n    return {\n      state: computed(() => props.hp > 0 ? \"alive\" : \"dead\")\n    }\n  }\n})\n</script>\n\n<template>\n  <div class=\"pokemon\" :class=\"`pokemon--${state}`\">\n    <h1>Pokemon {{ name }} (HP: {{hp}}/100)</h1>\n  </div>\n</template>\n\n<style>\n.pokemon {\n  font-size: 30px;\n}\n\n.pokemon--alive {\n  color: green;\n}\n\n.pokemon--dead {\n  color: darkred;\n}\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

export { __vue_component__ as Pokemon };
//# sourceMappingURL=pikalib.esm.js.map
