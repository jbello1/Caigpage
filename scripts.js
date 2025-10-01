// FORMULARIO DE CONTACTO → enviar a correo o WhatsApp (aquí ejemplo con WhatsApp)
const contactoForm = document.getElementById("contacto-form");
if (contactoForm) {
  contactoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const telefonoC = document.getElementById("telefonoC").value;
    const asunto = document.getElementById("asunto").value;
    const mensaje = document.getElementById("mensaje").value;

    const texto = `Nuevo contacto desde la web:\n\n👤 Nombre: ${nombre}\n📞 Tel: ${telefonoC}\n✉️ Email: ${correo}\n📌 Asunto: ${asunto}\n📝 Mensaje: ${mensaje}`;
    const url = `https://wa.me/569XXXXXXXX?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  });
}