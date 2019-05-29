# 推箱子  
这是一个推箱子游戏，项目参考自[百度前端技术学院2017任务](https://github.com/oubinke/2017ife-task/tree/master/hard/pushBox)，在这个基础上给游戏添加了一些功能：
* 后退按钮：当在游戏中某一步点错，点击按钮可以回到上一步，实现悔棋的功能  
```
step = [1 2 3 4 5]
step数组记录了历史的状态，假设当前游戏处于状态5，点击后退按钮可以回到状态4，再次点击可以回到状态3。
```
* 前进按钮：当多次点击后退按钮之后，点击前进按钮可以回到当前步骤的前一步  
```
step = [1 2 3 4 5]
step数组记录了历史的状态，假设当前游戏通过点击两次后退按钮处于状态3，点击前进按钮可以回到状态4，再次点击可以回到状态5。
```