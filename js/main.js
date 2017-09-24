(function(){
    'use strict';

    // 拷贝副本封装
    function copy(obj){
        var copyVal = Object.assign({}, obj);
        return copyVal;
    }

    new Vue({
        el: '#app',
        data: {
            todoList: [],
            current: {},
        },

        // 获得localStorage的todolist
        mounted: function() {
            this.todoList = ms.get('todoList') || this.todoList;
        },

        methods: {
            // 添加和更新
            merge: function() {
                var isUpdate, id;
                isUpdate = id = this.current.id;
                if (isUpdate) {
                    var index = this.find_index(id);
                    Vue.set(this.todoList, index, copy(this.current));
                } else{
                    var title = this.current.title
                    if (!title && title !== 0) return;
    
                    var todo = copy(this.current);
                    todo.id = this.nextId();
                    this.todoList.push(todo);
                }
                // console.log(this.todoList)
                // ms.set('todoList', this.todoList)
                this.resetCurrent();
            },
            // 删除
            remove: function(id) {
                var index = this.find_index(id)
                this.todoList.splice(index, 1);
                // ms.set('todoList', this.todoList)
            },
            // 回车后清空表单
            resetCurrent: function() {
                this.setCurrent({});
            },
            // 给每个计划添加id键
            nextId: function() {
                return this.todoList.length + 1;
            },
            // 更新todo副本，不使用current=todo
            setCurrent: function(todo) {
                this.current = copy(todo);
            },
            // 封装查找index
            find_index: function(id) {
                return this.todoList.findIndex(function(item) {
                    return item.id == id;
                });
            },
        },

        // 将每次改动传给localStorage
        // 调用watch方法,每次todolist有改动就调用handler方法
        watch: {
            todoList: {
                deep: true,
                handler: function(newVal, oldVal) {
                    if (newVal) {
                        ms.set('todoList', newVal);
                    } else{
                        ms.set('todoList', []);
                    }
                },
            }
        },

    });
})();