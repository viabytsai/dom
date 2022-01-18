window.dom={
    creat(string){
        //目标效果
        // 输入create("<div><span>你好</span></div>")
        // 自动创建好div和span
        //实现思路，直接把字符串写进InnerHTML
        // 用template是因为这个标签里可以容纳所有标签，
        // div标签里就不能放<tr></tr>标签，而template可以
        const container = document.createElement("template")
        container.innerHTML=String.prototype.trim.call(string)
        // 去掉多余空格
        return container.content.firstChild
    },
    after(node,newNode){
        // 目标是在Node节点后面插入node2节点
        // 但是DOM只提供了insertBefore接口
        // 1 -> 3
        // 在1后面插入2, 等价于在3的前面插入2
        // 所以我们转换为在node的下一个节点的前面插入node2
        node.parentNode.insertBefore(newNode,node.nextSibling)
    },
    before(node, newNode) {
        node.parentNode.insertBefore(newNode, node)
    },
    append(parent, node) {
        parent.appendChild(node)
    },
    wrap(node,parent){
        // 把parent 放到node前面
        // 把node append到parent里
        // 目标: div1
        //        ↓----> div2
        // 变成  div1
        //        ↓----> div3
        //                ↓----> div2
        dom.before(node,parent)
        dom.append(parent,node)
    },
    remove(node){
        node.parentNode.removeChild(node)
        return node
    },
    empty(node){
        // 等价于const childNodes = node.childNodes
        const {childNodes}=node
        // 坑：childNodes.length每次的Length会变化
        let x = node.firstChild
        while (x) {
            array.push(dom.remove(node.firstChild))
            x = node.firstChild
        }
        return array
    },
    attr(node,name,value){
        if (arguments.length === 3) {
            node.setAttribute(name, value)
        } else if (arguments.length === 2) {
            return node.getAttribute(name)
        }
    },
    text(node, string) {
        if (arguments.length === 2) {
            // 适配不同浏览器
            if ('innerText' in node) { //ie
                node.innerText = string
            } else { // firefox / chrome
                node.textContent = string
            }
        } else if (arguments.length === 1) {
            if ('innerText' in node) { //ie
                return node.innerText
            } else { // firefox / chrome
                return node.textContent
            }
        }
    },
    html(node,string){
        if(arguments.length===2){
            node.innerHTML=string
        }else if(arguments.length===1){
            return node.innerHTML
        }
    },
    style(node,name,value){
        if (arguments.length === 3) {
            // dom.style(div, 'color', 'red')
            node.style[name] = value
        } else if (arguments.length === 2) {
            if (typeof name === 'string') {
                //dom.style(test, 'border')
                // 获取某个css属性
                return node.style[name]
            }else if(name instanceof Object){
                for(let key in name){
                    node.style[key]=name[key]
                }
            }
        }
    },
    class:{
        add(node,className){
            node.classList.add(className)
        },
        remove(node, className) {
        node.classList.remove(className)
        },
        has(node, className) {
        return node.classList.contains(className)
        }
    },
    on(node,eventName,fn){
        node.addEventListener(eventName,fn)
    },
    off(node,eventName,fn){
        node.removeEventListener(eventName,fn)
    },
    find(selector, scope) {
        return (scope || document).querySelectorAll(selector)
    },
    parent(node) {
        return node.parentNode
    },
    children(node) {
        return node.children
    },    
    siblings(node) {
        // 我父母所有孩子里不是我的，就是我的兄弟姐妹
        return Array.from(node.parentNode.children).filter(n => n !== node)
    },
    next(node) { //获取弟弟
        let x = node.nextSibling
        while (x && x.nodeType === 3) {
            // x存在且x是文本
            x = x.nextSibling
        }
        return x
    },
    previous(node){ //获取哥哥
        let x = node.previousSibling
        while(x && x.nodeType === 3){
          x = x.previousSibling
        }
        return x
    },
    each(nodeList,fn){ //遍历所有节点
        for(let i=0;i<nodeList.length;i++){
            fn.call(null,nodeList[i])
        }
    },
    index(node){ //获取节点在父节点中的排名
        const list = dom.children(node.parentNode) //获取爸爸的所有儿子
        let i
        for(i =0;i<list.length;i++){
            if(list[i]===node){
                break
            }
        }
        return i
    }
}
