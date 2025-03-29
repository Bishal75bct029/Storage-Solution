# **Storage Management Solution**

This is a **Storage Management Solution** built with **Appwrite** and **Next.js**, similar to **Google Drive**. The application allows users to upload, manage, and share files securely.

<img src = "https://github.com/Bishal75bct029/Storage-Solution/blob/master/public/assets/images/projectDemo.png">
<img src = "https://github.com/Bishal75bct029/Storage-Solution/blob/master/public/assets/images/demo2.png">

## **Key Features**:

- **File Upload**: Users can upload files with a **maximum size of 10MB**
- **File Sharing**: Users can **share files** with other **existing users**
- **Rename and Delete Files**: Users can **rename** or **delete** their files
- **View Recently Uploaded Files**: Users can **view files uploaded recently**
- **OTP-Based Authentication**: Users can **sign up** and **log in using OTP**
- **File Type Detection**: Supports various **file types** (documents, images, videos, audio)

## **Technologies Used**:

- **Next.js**: Frontend framework
- **Appwrite**: Backend for storage and authentication
- **OTP Authentication**: Secure user management

---

## **Setup and Installation**

### **Option 1: Docker Setup (Recommended)**

#### **Prerequisites**

- Docker installed ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose (usually included with Docker)

#### **1. Clone the Repository**

```bash
git clone https://github.com/Bishal75bct029/Storage-Solution.git
cd storage-management
```

# Appwrite Configuration

NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=
NEXT_APPWRITE_SECRET_KEY=

# Database & Collections

NEXT_PUBLIC_APPWRITE_DATABASE=
NEXT_PUBLIC_COLLECTION_USERS=
NEXT_PUBLIC_COLLECTION_FILES=
NEXT_PUBLIC_APPWRITE_BUCKET=

# Optional (Adjust as needed)

NEXT_PUBLIC_MAX_FILE_SIZE=10485760 # 10MB in bytes

## **Running with Docker**

### **Prerequisites**

- Docker installed ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose (usually included with Docker)

### **1. Clone the Repository**

```bash
git clone https://github.com/your-repo/storage-management.git
cd storage-management
```

```bash
docker build --no-cache --progress=plain -t image-name .
```
