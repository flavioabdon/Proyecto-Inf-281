## Proyecto INF-281

## 1 Requisitos.

Instalar la versión 22.8.0 de Nodejs mediante Node Version Manager NVM

```plaintext
$ nvm install v22.8.0
```

Seleccionar la versión 22.8.0

```plaintext
$ nvm use v22.8.0
```

Verificar la version de Nodejs

```plaintext
$node -v
```

## 2 Base de Datos.

*   Ejecutar los scripts que estan dentro de la carptea postgres.
*   Modificar parámetros de conexión  a la base de datos en postgres,  en el archivo config/database.js
*   Modificar parámetros de correo y contraseña de cuenta de gmail desde la que se enviará mensajes config/mail.js
*   Permite el acceso a aplicaciones seguras en Gmail:  
    Por motivos de seguridad, Google tiene bloqueado el acceso a ciertas aplicaciones que intentan iniciar sesión en tu cuenta. Es por eso que, antes de nada, debemos permitir el acceso a tu cuenta a aplicaciones menos seguras. Esto es una configuración muy sencilla que puedes hacer directamente a través de este enlace : [https://myaccount.google.com/u/0/lesssecureapps?pli=1&rapt=AEjHL4NZzm8MNSVm0UMy1Bz7r_2d_6uq4Dwjaqn4rhLQ4p1b9jgtcae10HMMWDs3eI4HJf379Yy3RPixtwZ8NJQ32Kq7zeeRvg](https://myaccount.google.com/u/0/lesssecureapps?pli=1&rapt=AEjHL4NZzm8MNSVm0UMy1Bz7r_2d_6uq4Dwjaqn4rhLQ4p1b9jgtcae10HMMWDs3eI4HJf379Yy3RPixtwZ8NJQ32Kq7zeeRvg).
    
    ![](https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/01a74c9458d9988de468b4137935663d2efbe63bfb04d233.png)
*   Funciona solamente en cuentas institucionales como xxxxx@fcpn.edu.bo    

## 3 Ejecutar proyecto

Ir al directorio del proyecto

```plaintext
usuario@host:~$ cd ruta/carpetaProyeto
```

Instalar dependencias

```plaintext
usuario@host:~$ npm install
```
En WINDOWS previo a Instalar dependencias en caso de obtener error
Abrir PowerShell como administrador:  
    
    * Ejecutar  
    Set-ExecutionPolicy RemoteSigned

    * Verificar
    Get-ExecutionPolicy
    Esto debería mostrar RemoteSigned..

    * Para cambiar la política de ejecución en PowerShell nuevamente a Restricted:
    Set-ExecutionPolicy Restricted

Run

```plaintext
usuario@host:~$ node server.js 
```

Instalar paquete que permite guardar el path de las imagenes
```plaintext
npm install multer 
```

