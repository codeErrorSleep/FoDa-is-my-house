

页面名称改动：

homePage->index_main
news->news_main
index->goods
post->contact
mySecondPage->myGoods
uploadpost->uploadGoods
my->mine_main
set->setting
administrator->admin_main
adminSH->secondHand
adminUA->user

新建页面文件夹及其包含关系

Index：index_main, goods, contact

News：news_main, myGoods

Post：uploadGoods

Mine：mine_main, feedback, setting, registered

Admin：secondHand, user

数据库api：

位置：util/util.js

函数：function nextLoad(database, that, limit)

调用该函数page：

Index/goods

News/myGoods

Admin/secondHand

Admin/user

待办问题：

发布，快递，琐事页面没做