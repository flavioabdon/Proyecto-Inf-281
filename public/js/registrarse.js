document.getElementById('btnRegistrarse').addEventListener('click', function () {
    var article = document.getElementById('articleLoginRegistrarse');
    article.innerHTML = `
        <article class="about">
            <!-- btn container -->
            <div class="btn-container">
                <button class="tab-btn active" data-id="cliente">Cliente</button>
                <button class="tab-btn" data-id="artesano">Artesano</button>
                <button class="tab-btn" data-id="delivery">Delivery</button>
            </div>

            <div class="about-content">
                <div class="content active" id="cliente">
                    <h3 class="l-title">Cliente</h3>
                    <i class="fas fa-id-card l-icon"></i>
                    <form action="" method="POST" id="formCliente">
                        <div class="form-group">
                            <label for="nombres">Nombres</label>
                            <div class="input-icon">
                                <i class="fas fa-user"></i>
                                <input type="text" id="nombres" name="nombres" placeholder="Ingresa tus nombres" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="apellidoPaterno">Apellido Paterno</label>
                            <div class="input-icon">
                                <i class="fas fa-user"></i>
                                <input type="text" id="apellidoPaterno" name="apellidoPaterno" placeholder="Ingresa tu apellido paterno" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="apellidoMaterno">Apellido Materno</label>
                            <div class="input-icon">
                                <i class="fas fa-user"></i>
                                <input type="text" id="apellidoMaterno" name="apellidoMaterno" placeholder="Ingresa tu apellido materno" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="correoElectronico">Correo Electrónico</label>
                            <div class="input-icon">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="correoElectronico" name="correoElectronico" placeholder="Ingresa tu correo" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="contrasena">Contraseña</label>
                            <div class="input-icon">
                                <i id="togglePassword" class="fas fa-lock"></i>
                                <input type="password" class="password-field" id="contrasena" name="contrasena" placeholder="Contraseña (Máx. 8 caracteres)" title="La contraseña debe empezar con una letra mayúscula y tener hasta 8 caracteres (letras y números)" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="confirmarContrasena">Confirmar Contraseña</label>
                            <div class="input-icon">
                                <i id="toggleConfirmPassword" class="fas fa-lock"></i>
                                <input type="password" class="password-field" id="confirmarContrasena" name="confirmarContrasena" placeholder="Confirma tu contraseña" required>
                            </div>
                        </div>

                        <button type="submit" class="btn-l">Registrar</button>
                    </form>
                </div>

                <div class="content" id="artesano">
                    <h3 class="l-title">Artesano</h3>
                    <i class="fas fa-paint-brush l-icon"></i>
                    <form action="" method="" id="formArtesano">
                        <div class="form-group">
                            <label for="nombresArtesano">Nombres (Dueño/Encargado)</label>
                            <div class="input-icon">
                                <i class="fas fa-user"></i>
                                <input type="text" id="nombresArtesano" name="nombresArtesano" placeholder="Ingresa tus nombres" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="apellidoPaternoArtesano">Apellido Paterno</label>
                            <div class="input-icon">
                                <i class="fas fa-user"></i>
                                <input type="text" id="apellidoPaternoArtesano" name="apellidoPaternoArtesano" placeholder="Ingresa tu apellido paterno" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="apellidoMaternoArtesano">Apellido Materno</label>
                            <div class="input-icon">
                                <i class="fas fa-user"></i>
                                <input type="text" id="apellidoMaternoArtesano" name="apellidoMaternoArtesano" placeholder="Ingresa tu apellido materno" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="correoElectronicoArtesano">Correo Electrónico</label>
                            <div class="input-icon">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="correoElectronicoArtesano" name="correoElectronicoArtesano" placeholder="Ingresa tu correo electrónico" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="nombreComercio">Nombre de tu Comercio</label>
                            <div class="input-icon">
                                <i class="fas fa-store"></i>
                                <input type="text" id="nombreComercio" name="nombreComercio" placeholder="Ingresa el nombre de tu comercio" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="ubicacionComercio">¿Dónde se encuentra tu comercio?</label>
                            <div class="input-icon">
                                <i class="fas fa-map-marker-alt"></i>
                                <input type="text" id="ubicacionComercio" name="ubicacionComercio" placeholder="Departamento, Provincia, Comunidad" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="telefonoComercio">Teléfono</label>
                            <div class="input-icon">
                                <i class="fas fa-phone"></i>
                                <input type="tel" id="telefonoComercio" name="telefonoComercio" placeholder="Ingresa tu teléfono" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="contrasenaArtesano">Contraseña</label>
                            <div class="input-icon">
                                <i id="togglePasswordArtesano" class="fas fa-lock"></i>
                                <input type="password" class="password-field" id="contrasenaArtesano" name="contrasenaArtesano" placeholder="Ingresa tu contraseña" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="confirmarContrasenaArtesano">Confirmar Contraseña</label>
                            <div class="input-icon">
                                <i id="toggleConfirmPasswordArtesano" class="fas fa-lock"></i>
                                <input type="password" class="password-field" id="confirmarContrasenaArtesano" name="confirmarContrasenaArtesano" placeholder="Confirma tu contraseña" required>
                            </div>
                        </div>

                        <button type="submit" class="btn-l">Registrar</button>
                    </form>
                </div>

                <div class="content" id="delivery">
                    <h3 class="l-title">Delivery</h3>
                    <i class="fas fa-truck l-icon"></i>
                    <form action="" method="post" id="formDelivery">
                        <div class="form-group">
                            <label for="nombresDelivery">Nombres (Dueño/Encargado)</label>
                            <div class="input-icon">
                                <i class="fas fa-user"></i>
                                <input type="text" id="nombresDelivery" name="nombresDelivery" placeholder="Ingresa tus nombres" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="apellidoPaternoDelivery">Apellido Paterno</label>
                            <div class="input-icon">
                                <i class="fas fa-user"></i>
                                <input type="text" id="apellidoPaternoDelivery" name="apellidoPaternoDelivery" placeholder="Ingresa tu apellido paterno" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="apellidoMaternoDelivery">Apellido Materno</label>
                            <div class="input-icon">
                                <i class="fas fa-user"></i>
                                <input type="text" id="apellidoMaternoDelivery" name="apellidoMaternoDelivery" placeholder="Ingresa tu apellido materno" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="correoElectronicoDelivery">Correo Electrónico</label>
                            <div class="input-icon">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="correoElectronicoDelivery" name="correoElectronicoDelivery" placeholder="Ingresa tu correo electrónico" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="nombreEmpresa">Nombre de la Empresa Distribuidora/Transportadora</label>
                            <div class="input-icon">
                                <i class="fas fa-building"></i>
                                <input type="text" id="nombreEmpresa" name="nombreEmpresa" placeholder="Ingresa el nombre de tu empresa" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="telefonoEmpresa">Teléfono de la Empresa</label>
                            <div class="input-icon">
                                <i class="fas fa-phone"></i>
                                <input type="tel" id="telefonoEmpresa" name="telefonoEmpresa" placeholder="Ingresa el teléfono de tu empresa" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="ubicacionEmpresa">¿Dónde se registrará tu empresa?</label>
                            <div class="input-icon">
                                <i class="fas fa-map-marker-alt"></i>
                                <input type="text" id="ubicacionEmpresa" name="ubicacionEmpresa" placeholder="Departamento, Provincia, Comunidad" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="contrasenaDelivery">Contraseña</label>
                            <div class="input-icon">
                                <i id="togglePasswordDelivery" class="fas fa-lock"></i>
                                <input type="password" class="password-field" id="contrasenaDelivery" name="contrasenaDelivery" placeholder="Ingresa tu contraseña" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="confirmarContrasenaDelivery">Confirmar Contraseña</label>
                            <div class="input-icon">
                                <i id="toggleConfirmPasswordDelivery" class="fas fa-lock"></i>
                                <input type="password" class="password-field" id="confirmarContrasenaDelivery" name="confirmarContrasenaDelivery" placeholder="Confirma tu contraseña" required>
                            </div>
                        </div>

                        <button type="submit" class="btn-l">Registrar</button>
                    </form>
                </div>
            </div>
        </article>
    `;

    const about = document.querySelector(".about");
    const btns = document.querySelectorAll(".tab-btn");
    const articles = document.querySelectorAll(".content");

    about.addEventListener("click", function (e) {
        const id = e.target.dataset.id;
        if (id) {
            btns.forEach(function (btn) {
                btn.classList.remove("active");
            });
            e.target.classList.add("active");

            articles.forEach(function (article) {
                article.classList.remove("active");
            });
            const element = document.getElementById(id);
            element.classList.add("active");
        }
    });

    // Agregar evento al formulario para validar las contraseñas
    const formCliente = document.getElementById('formCliente');
    formCliente.addEventListener('submit', function (event) {
        const contrasena = document.getElementById('contrasena').value;
        const confirmarContrasena = document.getElementById('confirmarContrasena').value;

        if (contrasena !== confirmarContrasena) {
            event.preventDefault(); // Evita el envío del formulario
            alert('Las contraseñas no coinciden. Por favor, verifica que ambas contraseñas sean iguales.');
        }
    });

    const formArtesano = document.getElementById('formArtesano');
    formArtesano.addEventListener('submit', function (event) {
        const contrasenaArtesano = document.getElementById('contrasenaArtesano').value;
        const confirmarContrasenaArtesano = document.getElementById('confirmarContrasenaArtesano').value;

        if (contrasenaArtesano !== confirmarContrasenaArtesano) {
            event.preventDefault(); // Evita el envío del formulario
            alert('Las contraseñas no coinciden. Por favor, verifica que ambas contraseñas sean iguales.');
        }
    });

    const formDelivery = document.getElementById('formDelivery');
    formDelivery.addEventListener('submit', function (event) {
        const contrasenaDelivery = document.getElementById('contrasenaDelivery').value;
        const confirmarContrasenaDelivery = document.getElementById('confirmarContrasenaDelivery').value;

        if (contrasenaDelivery !== confirmarContrasenaDelivery) {
            event.preventDefault(); // Evita el envío del formulario
            alert('Las contraseñas no coinciden. Por favor, verifica que ambas contraseñas sean iguales.');
        }
    });
     
  capturarDatosFormulario();
});

