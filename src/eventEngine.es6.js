let events = new Map();

let shouldLog, isFunction, isNumber, sortByPriority, eventEngine;
shouldLog = false;
isFunction = (fn) => typeof fn === 'function';
isNumber = (val) => typeof val === 'number';
sortByPriority = (a, b) => a.priority - b.priority;

/**
 * Checks if this listener is already registered for this event.   *
 * @param e
 * @param callback
 * @returns {boolean}
 */

function hasListener(e, callback) {
  let listeners = events.get(e);
  for (let listener of listeners) if (callback === listener.fn) {
    if (shouldLog) console.log(`this listener is already registered for event ${e}`);
    return true;
  }
  return false;
}

/**
 * Subscribes a listener for an event. Event and callback are required params. Context and priority are optional.
 * @param e
 * @param callback
 * @param ..options (priority, context) //optional
 *
 * Usage:
 *
 * eventEngine.on('someEvent', someListener);             //params: event & listener
 * eventEngine.on('someEvent', someListener, 1);          //params: event, listener & priority
 * eventEngine.on('someEvent', someListener, window);     //params: event, listener & context
 * eventEngine.on('someEvent', someListener, window, 2);  //params: event, listener, context and priority
 *
 */

function on(e, callback, ...options) {

  let listeners, priority, context;

  //check if callback is a valid function
  if (!isFunction(callback)) {
    if (shouldLog) console.log('Event listener is not a function');
    return;
  }

  //Create event array if one doesn't exist.
  if (!events.has(e)) events.set(e, []);
  //if listener is already registered for the event, don't add it to array.
  else if (hasListener(e, callback)) return;

  listeners = events.get(e);
  // if function called with only 1 optional param we need to work out whether 3rd param is context or priority - if it's a number treat it as priority, else treat it as context.
  if (options.length === 1) {
    let optionalParam = options[0];
    if (isNumber(optionalParam)) [priority] = options;
    else [context] =  options;
  }
  //if 2 optional params, treat as context and priority respectively.
  if (options.length === 2) [context, priority] = options;
  //if no priority is specified, assign default priority.
  if (!priority) priority = 9999;
  listeners.push({fn: callback, context, priority});
  listeners.sort(sortByPriority);
}

/**
 * Unsubscribes a listener for an event
 * @param e
 * @param callback
 */

function off(e, callback) {
  let listeners = events.get(e);
  for (let [i,listener] of listeners.entries()) {
    if (callback === listener.fn) {
      listeners.splice(i, 1);
      return;
    }
  }
}

/**
 * Broadcasts an event
 * @param e
 * @param data
 */

function broadcast(e, data) {
  let listeners;
  if (!events.has(e)) {
    if (shouldLog) console.log(`${e} has no listeners`);
    return;
  }
  listeners = events.get(e);
  for (let listener of listeners) {
    let {context, fn} = listener;
    if (context) fn.call(context, data);
    else fn(data);
  }
}

/**
 * Returns array of listeners for a given event
 * @param e
 * @param callback
 */

function getListenersFor(e) {
  let listeners;

  //if no event of that name exists, return empty array;
  if (!e) {
    if (shouldLog) {
      console.log('No event of that names exists provided to find listeners for');
      return [];
    }
  }
  listeners = events.get(e);
  //this bit seems redundant
  if (!listeners) {
    if (shouldLog) console.log('No listeners');
    return [];
  }

  if (e) return listeners;
}

function removeAllListeners() {
  if (shouldLog) console.log('All events listeners removed');
  events.clear();
}

eventEngine = {
  on, off, broadcast, getListenersFor, removeAllListeners,

  get log() {
    return shouldLog;
  },
  set log(value) {
    shouldLog = value;
  }
};


export default eventEngine;
