(function(){
    'use strict';

    // 拷贝副本封装
    function copy(obj){
        var copyVal = Object.assign({}, obj);
        return copyVal;
    }

    var song = document.getElementById('song');

    new Vue({
        el: '#app',
        data: {
            todoList: [],
            current: {},
            isFocus: false,
            detailShow: false,
            isLight: false,
            song: song,
			lastId: 0,
        },

        // 获得localStorage的todolist
        mounted: function() {
            var me = this;
            this.todoList = ms.get('todoList') || this.todoList;
			this.lastId = ms.get('lastId') || this.lastId;

            // 打开应用提醒
            setInterval(function() {
                me.showAlerted();
            },1000);
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
                    var title = this.current.title;
                    var detail = this.current.detail;
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
				this.lastId += 1;
				ms.set('lastId', this.lastId);
                return this.lastId;
            },
            // 更新todo副本，不使用current=todo
            setCurrent: function(todo) {
                this.current = copy(todo);
                this.isFocus = true;
            },
            // 封装查找index
            find_index: function(id) {
                return this.todoList.findIndex(function(item) {
                    return item.id == id;
                });
            },

            // 完成与未完成
            toggleComplete: function(id) {
                var index = this.find_index(id);
                Vue.set(this.todoList[index], 'completed', !this.todoList[index].completed)
            },

            // 显示详细
            showDetail: function(id) {
                var index = this.find_index(id);
                var detail = this.todoList[index].detail;
                var alerted = this.todoList[index].datetime;
                
                var detailDiv = document.getElementById(id);
                if (detail || alerted) {
                    if (detailDiv.style.display === "block") {
                        detailDiv.style.display = "none";
                    } else{
                        detailDiv.style.display = "block";
                        
                    }
                }
            },

            // 提醒
            showAlerted: function() {
                var me = this;
                
                this.todoList.forEach(function(ele, i) {
                    var alertedTime = ele.datetime;
                    if (!alertedTime || ele.alerted_confirmed) return;

                    var alertedTime = (new Date(alertedTime)).getTime();
                    var now = (new Date()).getTime();
                    
                    if (now >= alertedTime) {
                        me.songPlay();
                        var confirmed = confirm('时间到：' + ele.title + '\n' + '详情：' + ele.detail);
                        Vue.set(me.todoList[i], 'alerted_confirmed', confirmed);
                    }
                });
            },
            // music
            songPlay: function() {
                
                this.song.play();
            }
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