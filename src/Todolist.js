import React, { Component } from 'react'
import axios from "axios"
export default class Todolist extends Component {
    state={
        list:[],//定义一个list状态
        username:"",
        age:0
    }
    // 组件挂载完毕，用来进行异步请求
    componentDidMount(){
        this.getData()
    }
    getData=()=>{
        axios.get("http://localhost:4000/list").then(res=>{
            this.setState({    
                list:res.data
            })
        })
    }
    handleChange=e=>{
        this.setState({
            [e.target.id]:e.target.value
        })
    }
    add=()=>{
       axios.post("http://localhost:4000/list",{
           username:this.state.username,
           age:this.state.age
       }).then(res=>{
        //    重新请求后端数据
        this.getData()
        // 请求输入框值
        this.setState({username:"",age:0})
       }) 
    }
    // 删除功能
    delete=id=>{
        axios.delete("http://localhost:4000/list/"+id).then(res=>{
            this.getData()
        })
    }
    // 修改功能
    update=({username,age,id})=>{
        // 弹窗
        let value=prompt("请输入修改的值",username+","+age)
        let arr=value.split(",")
        axios.patch("http://localhost:4000/list/"+id,{
            username:arr[0],
            age:arr[1]
        }).then(res=>{
            this.getData()
        })
    }
    // 模糊查询
    blur=()=>{
        let keyword=prompt("请输入关键字")
        axios.get("http://localhost:4000/list?username_like="+keyword).then(res=>{
            // console.log(res.data)
            this.setState({
                list:res.data
            })
        })
    }
    render() {
        let {username,age,list}=this.state;
        return (
            <div>
                <input id="username" type="text" value={username} onChange={this.handleChange} placeholder="请输入用户名" />
                <input id="age" type="number" value={age} onChange={this.handleChange} placeholder="请输入年龄" />
                <button onClick={this.add}>添加</button>
                <button onClick={this.blur}>模糊查询</button>
                <button onClick={()=>{this.getData()}}>返回</button>
                <ul>
                    {
                       list.map((item)=>{
                        return <li key={item.id}>
                            {item.username}---{item.age}
                            <button onClick={this.delete.bind(this,item.id)}>删除</button>
                            <button onClick={this.update.bind(this,item)}>修改</button>
                        </li>
                        })
                    }
                </ul>
            </div>
        )
    }
}
