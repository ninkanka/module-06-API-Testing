import { test } from 'node:test';
import assert from 'node:assert/strict';

const baseUrl = 'https://restful-booker.herokuapp.com';
let token;
let bookingId;

test('Create a new auth token', async () => {
    const response = await fetch(`${baseUrl}/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'admin',
            password: 'password123'
        })
    });
    assert.equal(response.status, 200, 'Response status should be 200');
    assert.match(response.headers.get('content-type'), /application\/json/, 'Content-Type should be application/json');
    const data = await response.json();
    token = data.token;
    assert.ok(token, 'Auth token should be created');
});

test('Create a new booking', async () => {
    const response = await fetch(`${baseUrl}/booking`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstname: 'Ola',
            lastname: 'Nowak',
            totalprice: 1200,
            depositpaid: true,
            bookingdates: {
                checkin: '2026-11-01',
                checkout: '2026-11-11'
            },
            additionalneeds: 'Bed for child'
        })
    });
    assert.equal(response.status, 200, 'Response status should be 200');
    assert.match(response.headers.get('content-type'), /application\/json/, 'Content-Type should be application/json');
    const data = await response.json();
    bookingId = data.bookingid;
    assert.ok(bookingId, 'Booking ID should be created');
    assert.equal(data.booking.firstname, 'Ola', 'First name should be Ola');
    assert.equal(data.booking.lastname, 'Nowak', 'Last name should be Nowak');
});

test('Get the created booking', async () => {
    const response = await fetch(`${baseUrl}/booking/${bookingId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    });
    assert.equal(response.status, 200, 'Response status should be 200');
    assert.match(response.headers.get('content-type'), /application\/json/, 'Content-Type should be application/json');
    const data = await response.json();
    assert.equal(data.firstname, 'Ola', 'First name should be Ola');
    assert.equal(data.totalprice, 1200, 'Total price should be 1200');
});

test('Update the created booking', async () => {
    const response = await fetch(`${baseUrl}/booking/${bookingId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            cookie: `token=${token}`
        },
        body: JSON.stringify({
            firstname: 'Ola',
            lastname: 'Nowak',
            totalprice: 2000,
            depositpaid: true,
            bookingdates: {
                checkin: '2026-11-01',
                checkout: '2026-11-11'
            },
            additionalneeds: 'Breakfast'
        })

    });
    assert.equal(response.status, 200, 'Response status should be 200');
    assert.match(response.headers.get('content-type'), /application\/json/, 'Content-Type should be application/json');
    const data = await response.json();
    assert.equal(data.totalprice, 2000, 'Total price should be updated to 2000');
    assert.equal(data.additionalneeds, 'Breakfast', 'Additional needs should be updated to Breakfast');
});

test('Delete the created booking', async () => {
    const response = await fetch(`${baseUrl}/booking/${bookingId}`, {
        method: 'DELETE',
        headers: {
            cookie: `token=${token}`
        },
    });
    assert.equal(response.status, 201, 'Response status should be 201');
    assert.match(response.headers.get('content-type'), /text\/plain/, 'Content-Type should be text/plain');
    const text = await response.text();
    assert.equal(text, 'Created', 'Response body should be "Created"');
});

test('Get the deleted booking', async () => {
    const response = await fetch(`${baseUrl}/booking/${bookingId}`, {
        method: 'GET',
    });
    assert.equal(response.status, 404, 'Response status should be 404');
    assert.match(response.headers.get('content-type'), /text\/plain/, 'Content-Type should be text/plain');
    const text = await response.text();
    assert.equal(text, 'Not Found', 'Response body should be "Not Found"');
});