import eventEngine from '../src/eventEngine.es6.js';

describe('eventEngine',  () => {
  /*beforeEach(() => {
    eventEngine = Object.create(_eventEngine_);
  });*/

  afterEach( () => eventEngine.removeAllListeners() );

  it('should add a listener ', () => {
    eventEngine.on('someEvent', function someEventListener(){}, 1);
    expect(eventEngine.getListenersFor('someEvent').length).toEqual(1);
  });

  it('should sort listeners by priority', () => {
    eventEngine.on('someEvent', function listener1(){}, 10);
    eventEngine.on('someEvent', function listener2(){}, 1);
    var listener = eventEngine.getListenersFor('someEvent');

    expect(listener[0].priority).toEqual(1);
    expect(listener[1].priority).toEqual(10);
  });

  it('should remove a listener ', () => {

    function someEventListener(){}

    expect(eventEngine.getListenersFor('someEvent').length).toBe(0);

    eventEngine.on('someEvent', someEventListener);
    expect(eventEngine.getListenersFor('someEvent').length).toBe(1);

    eventEngine.off('someEvent', someEventListener);
    expect(eventEngine.getListenersFor('someEvent').length).toBe(0);

  });

  it('should dispatch an event', () => {

    //create spy function to be used as mock listener for event dispatch
    var onTalk = jasmine.createSpy();
    //subscribe
    eventEngine.on('talk', onTalk);
    eventEngine.broadcast('talk', 'hello');
    expect(onTalk).toHaveBeenCalled();

  });

  describe('optional function parameters', () => {
    it('should treat single optional parameter of type number, as listener priority parameter', () => {
      eventEngine.on('someEvent', function someEventListener(){}, 2);
      eventEngine.on('someEvent', function someEventListener(){}, 2);
      expect(eventEngine.getListenersFor('someEvent')[0].priority).toEqual(2);
    });

    it('should treat single optional parameter, not of type number, as listener context parameter', () => {
      function thing() {}
      eventEngine.on('someEvent', function someEventListener(){}, thing);
      expect(eventEngine.getListenersFor('someEvent')[0].context).toBe(thing);
    });

    it('should treat 2 optional parameters as context & priority respectively', () => {
      function thing() {}
      eventEngine.on('someEvent', function someEventListener(){}, thing, 15);
      var listener = eventEngine.getListenersFor('someEvent')[0];
      expect(listener.context).toBe(thing);
      expect(listener.priority).toBe(15);
    });
  });
});


