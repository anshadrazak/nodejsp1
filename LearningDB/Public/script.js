document.getElementById('sendForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const uname = document.getElementById('uname').value;
    const theirid = document.getElementById('theirid').value;
    const amount = document.getElementById('amount').value;

    const response = await fetch('http://localhost:3000/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uname, theirid, amount })
    });

    const result = await response.text();
    document.getElementById('sendResponse').innerText = result;
});

document.getElementById('receiveForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const uname = document.getElementById('rname').value;

    const response = await fetch('http://localhost:3000/receive', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uname })
    });

    const result = await response.text();
    document.getElementById('receiveResponse').innerText = result;
});

document.getElementById('balanceForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const uname = document.getElementById('bname').value;

    const response = await fetch(`http://localhost:3000/balance?uname=${uname}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const result = await response.text();
    document.getElementById('balanceResponse').innerText = result;
});
