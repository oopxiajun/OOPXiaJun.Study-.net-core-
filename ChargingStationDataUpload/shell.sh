scp root@192.168.101.22:/usr/program/tomcat-7/RUNNING.txt D:/test_db/RUNNING.txt
expect {
 "(yes/no)?" {
   send "yes\n"
   expect "*assword:" { send "123456\n"}
  }
  "*assword:" {
   send "123456\n"
  }
}
expect eof 