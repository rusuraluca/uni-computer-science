"""
All programs will be written in versions of C or Python with commented code.
Topic: public key cryptography.
 Each team of two students will be assigned one of the following ciphers during the labs:
1. RSA.
2. Rabin.
3. ElGamal (basic version).
 Create a project with the following features:
(i) Setting. The alphabet will have 27 characters: the blank and the 26 letters of the English
alphabet.
(ii) Generates a public key and a private key. The public key will be randomly generated in the
required interval.
(iii) Using the public key, encrypts a given plaintext. There will be a plaintext validation.
(iv) Using the private key, decrypts a given ciphertext. There will be a ciphertext validation.
Points
 1.5 points for each member of the team if handed in by Week 13 (odd week groups) or Week 14
(even week groups).
Note: Each student will keep her/his semigroup for the lab throughout the semester! Taking and
presenting labs in weeks with a changed parity may only be done in exceptional cases, if the teaching
assistant agrees with it and if time allows.
"""

import random
from sympy import isprime, primerange

# Define the alphabet
alphabet = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'

def generate_keys():
    # Choose a large prime number p
    primes = list(primerange(1000, 5000))
    p = random.choice(primes)

    # Choose g, a primitive root modulo p
    g = random.choice(range(2, p - 1))

    # Choose a private key x
    x = random.choice(range(2, p - 1))

    # Compute the public key y
    y = pow(g, x, p)

    # Public key (p, g, y) and private key x
    return (p, g, y), x

def encrypt(plaintext, public_key):
    p, g, y = public_key
    k = random.choice(range(2, p - 1))
    C1 = pow(g, k, p)
    encrypted_msg = []
    for char in plaintext:
        # Validate the character
        if char not in alphabet:
            raise ValueError("Invalid character in plaintext.")
        m = alphabet.index(char)
        C2 = (m * pow(y, k, p)) % p
        encrypted_msg.append((C1, C2))
    return encrypted_msg

def decrypt(encrypted_msg, private_key, public_key):
    p, _, _ = public_key
    plaintext = ''
    for C1, C2 in encrypted_msg:
        m = (C2 * pow(C1, p - 1 - private_key, p)) % p
        plaintext += alphabet[m]
    return plaintext


def main():
    public_key, private_key = generate_keys()

    plaintext = "HELLO WORLD"
    encrypted_msg = encrypt(plaintext, public_key)
    decrypted_msg = decrypt(encrypted_msg, private_key, public_key)

    print(f"Original Message: {plaintext}")
    print(f"Encrypted Message: {encrypted_msg}")
    print(f"Decrypted Message: {decrypted_msg}")


if __name__ == "__main__":
    main()