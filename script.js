// تحميل البيانات عند فتح الصفحة
window.onload = function () {

    for (let i = 1; i <= 5; i++) {

        let session = JSON.parse(localStorage.getItem("ps" + i));

        if (!session) continue;

        document.getElementById("name" + i).value = session.customer;
        document.getElementById("type" + i).value = session.type;
        document.getElementById("hours" + i).value = session.hours;
        document.getElementById("price" + i).value = session.price;

        document.getElementById("status" + i).innerHTML = "🔴 مشغول";
        document.getElementById("btn" + i).innerHTML = "إنهاء الجلسة";
    }

};

// تحديث الوقت كل ثانية
setInterval(updateTimers, 1000);

function updateTimers() {

    for (let i = 1; i <= 5; i++) {

        let session = JSON.parse(localStorage.getItem("ps" + i));

        if (!session) continue;

        let diff = Date.now() - session.startTime;

        // الوقت
        let minutes = Math.floor(diff / 60000);
        let seconds = Math.floor((diff % 60000) / 1000);

        document.getElementById("time" + i).innerHTML =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        // حساب السعر (على أساس سعر الساعة)
        let total = (diff / 3600000) * Number(session.price);

        document.getElementById("total" + i).innerHTML =
            total.toFixed(2);

        // لو الجلسة بالدقائق
        if (session.type === "hour") {

            let limit = Number(session.hours) * 60000;

            if (diff >= limit) {

                endSession(i);

            }

        }

    }

}


// بدء أو إنهاء الجلسة
function toggleSession(id) {

    const btn = document.getElementById("btn" + id);

    // بدء الجلسة
    if (btn.innerHTML === "ابدأ الجلسة") {

        let customer = document.getElementById("name" + id).value;
        let type = document.getElementById("type" + id).value;
        let hours = document.getElementById("hours" + id).value;
        let price = document.getElementById("price" + id).value;

        if (customer.trim() === "") {
            alert("اكتب اسم العميل");
            return;
        }

        let session = {
            customer,
            type,
            hours,
            price,
            startTime: Date.now()
        };

        localStorage.setItem("ps" + id, JSON.stringify(session));

        document.getElementById("status" + id).innerHTML = "🔴 مشغول";
        btn.innerHTML = "إنهاء الجلسة";

    }

    // إنهاء الجلسة
    else {

        let total =
            document.getElementById("total" + id).innerHTML;

        document.getElementById("invDevice").innerHTML = "PS5-" + id;

        document.getElementById("invCustomer").innerHTML =
        document.getElementById("name"+id).value;

        document.getElementById("invTime").innerHTML =
        document.getElementById("time"+id).innerHTML;

        document.getElementById("invTotal").innerHTML =
total;

document.getElementById("invoiceModal").style.display="flex";

        localStorage.removeItem("ps" + id);

        document.getElementById("status" + id).innerHTML = "🟢 متاح";
        document.getElementById("time" + id).innerHTML = "00:00:00";
        document.getElementById("total" + id).innerHTML = "0";

        document.getElementById("name" + id).value = "";
        document.getElementById("hours" + id).value = "";

        btn.innerHTML = "ابدأ الجلسة";
    }

}
function closeInvoice(){

    document.getElementById("invoiceModal").style.display="none";

}
function endSession(id){

    let session = JSON.parse(localStorage.getItem("ps"+id));

    let total = document.getElementById("total"+id).innerHTML;

    document.getElementById("invDevice").innerHTML = "PS5-" + id;
    document.getElementById("invCustomer").innerHTML = session.customer;
    document.getElementById("invTime").innerHTML =
    document.getElementById("time"+id).innerHTML;
    document.getElementById("invTotal").innerHTML = total;

    document.getElementById("invoiceModal").style.display="flex";

    alert("⏰ انتهى الوقت المحدد للجلسة");

    localStorage.removeItem("ps"+id);

    document.getElementById("status"+id).innerHTML="🟢 متاح";
    document.getElementById("btn"+id).innerHTML="ابدأ الجلسة";
    document.getElementById("time"+id).innerHTML="00:00:00";
    document.getElementById("total"+id).innerHTML="0";

    document.getElementById("name"+id).value="";
    document.getElementById("hours"+id).value="";
}