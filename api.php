<?php
error_reporting(0);
header('Access-Control-Allow-Origin:*');
$title=str_replace(' ','-',strtolower($_POST['title']));
$file='./_posts/'.date('Y-m-d').'-'.$title.'.md';
$ret=shell_exec('rake post  title="'.$title.'"');
if(strpos($ret,'overwrite'))
{
    exit('文章标题重复');
}

$file_content='
 ---
layout: post
title: "'.$_POST['subject'].'"
description: "'.$_POST['description'].'"
category:"'.$_POST['category'].'" 
tags: ['.$_POST['tags'].']
---
{% include JB/setup %}   
'.PHP_EOL.$_POST['content'];
file_put_contents($file,$file_content);
shell_exec('git add '.$file);
shell_exec("git commit -am '添加文章《{$_POST['subject']}'》");
shell_exec("git config --global push.default simple");
$ret=shell_exec("/Users/luofei/soft/gitpush github 2>&1");
var_dump($ret);
exit('success');
