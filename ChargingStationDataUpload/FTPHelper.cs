using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;

namespace ChargingStationDataUpload
{
    public class FTPHelper
    {

        public static void Upload(FileInfo file, string pathName)
        {
            string rootPath = @"ftp://" + AppConfig.FTPServerIP + "/dev/neomp-data/";//根目录 
            CheckDirectoryAndMake(rootPath, pathName);

            //文件上传地址根目录，这里通过IIS架设本地主机为FTP服务器 
            string FileSaveUri = rootPath + pathName;

            Stream requestStream = null;
            Stream fileStream = null;
            FtpWebResponse uploadResponse = null;//创建FtpWebResponse实例uploadResponse
                                                 //Btn_Upload.

            //获取文件长度
            int FileLength = Convert.ToInt32(file.Length);
            //限制上传文件最大不能超过1G
            if (FileLength < 1024 * 1024 * 1024)
            {
                try
                {

                    //格式化为URI
                    Uri uri = new Uri(FileSaveUri + "/" + Path.GetFileName(file.Name));
                    FtpWebRequest uploadRequest = (FtpWebRequest)WebRequest.Create(uri);//创建FtpWebRequest实例uploadRequest
                    uploadRequest.Method = WebRequestMethods.Ftp.UploadFile;//将FtpWebRequest属性设置为上传文件
                    uploadRequest.Credentials = new NetworkCredential(AppConfig.FTPServerUserID, AppConfig.FTPServerPassword);//认证FTP用户名密码
                    requestStream = uploadRequest.GetRequestStream();//获得用于上传FTP的流
                    byte[] buffer = new byte[FileLength];
                    fileStream = file.OpenRead();//.PostedFile.InputStream;//截取FileUpload获取的文件流，作为上传FTP的流
                    fileStream.Read(buffer, 0, FileLength);
                    requestStream.Write(buffer, 0, FileLength);//将buffer写入流
                    requestStream.Close();
                    uploadResponse = (FtpWebResponse)uploadRequest.GetResponse();//返回FTP服务器响应，上传完成
                                                                                 //上传成功

                }
                catch (Exception ex)
                {
                    //无法上传 
                    return;
                }
                finally
                {
                    if (uploadResponse != null)
                        uploadResponse.Close();
                    if (fileStream != null)
                        fileStream.Close();
                    if (requestStream != null)
                        requestStream.Close();
                }
            }//end if #FileLength#
            else
            {
                //上传文件过大  
                return;
            }

        }


        /// <summary>
        /// 创建目录
        /// </summary>
        /// <param name="dirName"></param>
        public static void MakeDir(string dirName)
        {
            try
            {
                Uri uri = new Uri(dirName);
                FtpWebRequest uploadRequest = (FtpWebRequest)WebRequest.Create(uri);//创建FtpWebRequest实例uploadRequest    
                uploadRequest.Method = WebRequestMethods.Ftp.MakeDirectory;
                uploadRequest.Credentials = new NetworkCredential(AppConfig.FTPServerUserID, AppConfig.FTPServerPassword);//认证FTP用户名密码
                uploadRequest.KeepAlive = false;
                FtpWebResponse response = (FtpWebResponse)uploadRequest.GetResponse();
                response.Close();
            }

            catch (Exception ex)
            {
                throw new Exception("创建文件夹失败，原因: " + ex.Message);
            }

        }


        //获取子目录
        public static string[] GetDirectoryList(string dirName)
        {
            string[] drectory = GetFilesDetailList(dirName);
            List<string> strList = new List<string>();
            if (drectory.Length > 0)
            {
                foreach (string str in drectory)
                {
                    if (str.Trim().Length == 0)
                        continue;
                    //会有两种格式的详细信息返回
                    //一种包含<DIR>
                    //一种第一个字符串是drwxerwxx这样的权限操作符号
                    //现在写代码包容两种格式的字符串
                    if (str.Trim().Contains("<DIR>"))
                    {
                        strList.Add(str.Substring(39).Trim());
                    }
                    else
                    {
                        if (str.Trim().Substring(0, 1).ToUpper() == "D")
                        {
                            strList.Add(str.Substring(55).Trim());
                        }
                    }
                }
            }
            return strList.ToArray();
        }
        public static void CheckDirectoryAndMake(string rootDir, string remoteDirName)
        {
            if (!DirectoryExist(rootDir, remoteDirName))//判断当前目录下子目录是否存在
                MakeDir(rootDir + remoteDirName);
        }
        /// <summary>
        /// 判断当前目录下指定的子目录是否存在
        /// </summary>
        /// <param name="RemoteDirectoryName">指定的目录名</param>
        public static bool DirectoryExist(string rootDir, string RemoteDirectoryName)
        {
            string[] dirList = GetDirectoryList(rootDir);//获取子目录
            if (dirList.Length > 0)
            {
                foreach (string str in dirList)
                {
                    if (str.Trim() == RemoteDirectoryName.Trim())
                    {
                        return true;
                    }
                }
            }
            return false;
        }
        /// <summary>
        /// 获得文件明晰
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public static string[] GetFilesDetailList(string path)
        {
            StringBuilder result = new StringBuilder();
            try
            {
                Uri uri = new Uri(path);
                FtpWebRequest uploadRequest = (FtpWebRequest)WebRequest.Create(uri);//创建FtpWebRequest实例uploadRequest    
                uploadRequest.Method = WebRequestMethods.Ftp.ListDirectoryDetails;
                uploadRequest.Credentials = new NetworkCredential(AppConfig.FTPServerUserID, AppConfig.FTPServerPassword);//认证FTP用户名密码
                uploadRequest.KeepAlive = false;
                FtpWebResponse response = (FtpWebResponse)uploadRequest.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream(), System.Text.Encoding.Default);//中文文件名
                string line = reader.ReadLine();

                while (line != null)
                {
                    result.Append(line);
                    result.Append("\n");
                    line = reader.ReadLine();
                }

                // to remove the trailing '' '' 
                if (result.ToString() != "")
                {
                    result.Remove(result.ToString().LastIndexOf("\n"), 1);
                }
                reader.Close();
                response.Close();
                return result.ToString().Split('\n');
            }

            catch (Exception ex)
            {
                throw new Exception("获取文件列表失败。原因： " + ex.Message);
            }
        }
    }

}
