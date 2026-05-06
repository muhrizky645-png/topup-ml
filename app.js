async function buyNow(){

    const userid = document.getElementById("userid").value;
    const zone = document.getElementById("zone").value;

    alert("Mengirim order...");

    fetch("/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            product: selectedProduct,
            userid: userid,
            zone: zone
        })
    })
    .then(res => res.json())
    .then(data => {

        alert(
            "Order Berhasil\n\n" +
            "Produk: " + data.product
        );

    })
    .catch(err => {

        alert("Error Server");

        console.log(err);

    });

}
