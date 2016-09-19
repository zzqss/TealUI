
// #region 事件

/**
 * 表示一个事件分发器。
 */
export class EventEmitter {

    /**
     * 存储当前对象的所有事件。
     */
    private _events: { [eventName: string]: Function[] }

    /**
     * 添加一个事件监听器。
     * @param eventName 要添加的事件名。
     * @param eventListener 要添加的事件监听器。监听器可以返回 false 终止事件。
     * @example new EventEmitter().on('click', function (e) { return true; });
     */
    on(eventName: string, eventListener: Function) {

        // 获取存储事件对象的空间。
        const events = this._events || (this._events = {});

        // 获取当前事件对应的函数监听器列表。
        const eventListeners = events[eventName];

        // 如果未绑定过这个事件, 则创建列表，否则添加到列表末尾。
        if (eventListeners) {
            eventListeners.push(eventListener);
        } else {
            events[eventName] = [eventListener];
        }

        return this;
    }

    /**
     * 删除一个或多个事件监听器。
     * @param eventName 要删除的事件名。如果不传递此参数，则删除全部事件的全部监听器。
     * @param eventListener 要删除的事件处理函数。如果不传递此参数，在删除指定事件的全部监听器。
     * @remark
     * #### 绑定引用
     * 注意: `function () {} !== function () {}`, 这意味着下列代码的 off 将失败:
     * 
     *      base.on('click', function () {});
     *      base.off('click', function () {});   // 无法删除 on 绑定的函数。
     * 
     * 正确的做法是把函数保存起来。 
     * 
     *      var fn =  function () {};
     *      elem.on('click', fn);
     *      elem.off('click', fn); // fn  被成功删除。
     *
     * 如果同一个 *eventListener* 被增加多次，off 只删除第一个。
     * @example
     * var base = new EventEmitter(); // 创建一个实例。
     * function fn() { }
     * base.on('click', fn); // 绑定一个 click 事件。
     * base.off('click', fn); // 删除一个 click 事件。
     */
    off(eventName: string, eventListener: Function) {

        // 获取本对象 本对象的数据内容 本事件值
        const events = this._events;
        if (events) {

            // 获取指定事件的监听器。
            const listeners = events[eventName];
            if (listeners) {

                // 如果删除特定的处理函数。
                // 搜索特定的处理函数。
                if (eventListener) {
                    const index = listeners.indexOf(eventListener);
                    index >= 0 && listeners.splice(index, 1);
                    eventListener = listeners.length as any;
                }

                // 如果不存在任何事件，则直接删除整个事件处理器。
                if (!eventListener) {
                    delete events[eventName];
                }

            } else if (!eventName) {
                delete this._events;
            }

        }
        return this;
    }

    /**
     * 触发一个事件。
     * @param eventName 要触发的事件名。
     * @param eventArgs 传递给监听器的参数。
     * @returns 如果事件被阻止则返回 false，否则返回 true。
     * @example
     * var base = new EventEmitter(); // 创建一个实例。
     * base.on('click', function (e) { alert("事件触发了"); }); // 绑定一个 click 事件。
     * base.trigger('click'); // 手动触发 click， 即执行  on('click') 过的函数。
     */
    trigger(eventName: string, ...eventArgs: any[]): boolean;
    trigger(eventName: string) {
        let listeners: any = this._events;
        if (listeners && (listeners = listeners[eventName])) {
            // 加速仅 1 个处理函数的情况。
            if (listeners.length === 1) {
                listeners = listeners[0];
                switch (arguments.length) {
                    case 1:
                        return listeners.call(this) !== false;
                    case 2:
                        return listeners.call(this, arguments[1]) !== false;
                    default:
                        return listeners.apply(this, Array.prototype.slice.call(arguments, 1)) !== false;
                }
            }
            listeners = listeners.slice(0);
            for (let i = 0, listener, args = Array.prototype.slice.call(arguments, 1); (listener = listeners[i]); i++) {
                if (listener.apply(this, args) === false) {
                    return false;
                }
            }
        }
        return true;
    }

}

// #endregion

    // describe('events', function () {
    //     var events = require("../lib/utility/events.js");
    //     it('EventEmitter', function () {
    //         var ee = new events.EventEmitter();
    //         var shouldBeTrue = false;
    //         ee.on('click', function (e) {
    //             shouldBeTrue = e;
    //         });
    //         ee.trigger('click', true);
    //         assert.equal(shouldBeTrue, true);
    //     });
    // });
