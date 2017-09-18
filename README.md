# 慢病管理

webpack2 + vue + vue-resource + mint-ui + 环信

```
npm run dev //开发调试
npm run build //发布编译
```

## 编码规范(通过eslint约束)

* 缩进：

    统一一下，按一下tab等于4个空格，每一行开头的缩进都是1个tab，也就是4个空格。特殊情况，switch...case语句的时候，switch语句后的代码块里的语句不缩进，和switch在同一列

* 空格

    见WebStorm配置
    
* 变量声明和初始化，最好都提到一个代码块的最上面，变量最好都在声明的时候给一个初始化的默认值
    


## WebStorm配置

* 编辑器采用es6

    Settings -> Editor -> Inspections -> Javascript -> General
 
* switch缩进控制

    Settings -> Editor -> Code Style -> Javascript -> Wrapping and Braces
    
    去除indent 'case' branches 勾选
    
* 空格配置

    Settings -> Editor -> Code Style -> Javascript -> Within
    
    勾选ES6 import/export braces

* 去除大部分unresolved警告

    Settings -> Languages&Frameworks -> Javascript -> ECMAScript6
    
* 去除vue下template的未知标签和属性的警告 
   
   Settings -> Editor -> Inspections -> HTML
       
   去除unknown html tag和unknown html tag attribute这两项的勾选
   
* 去除vue下empty body警告
  
  Settings -> Editor -> Inspections -> XML
      
  去除XML tag empty body这项的勾选
  
 ## .vue文件less和es6的高亮显示

```     
<style lang="less" rel="stylesheet/less">

<script lang="babel">
```
        

