import mysql.connector
import tkinter as tk
from tkinter import messagebox
from pyfingerprint.pyfingerprint import PyFingerprint

class FingerprintGUI:
    def __init__(self, master):
        self.master = master
        self.master.title("Fingerprint Database")

        self.label = tk.Label(master, text="Press 'Capture' to store fingerprint data in database")
        self.label.pack()

        self.capture_button = tk.Button(master, text="Capture", command=self.capture_fingerprint)
        self.capture_button.pack()
        self.db_connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="samdb"
        )
        self.cursor = self.db_connection.cursor()

    def capture_fingerprint(self):
        try:
            f = PyFingerprint('/dev/ttyUSB0', 57600, 0xFFFFFFFF, 0x00000000)

            if not f.verifyPassword():
                messagebox.showerror("Error", "The given fingerprint sensor password is wrong!")
                return

            print('Waiting for finger...')
            self.label.config(text="Waiting for finger...")

            while not f.readImage():
                pass

            f.convertImage(0x01)
            finger_data = f.downloadCharacteristics()
            insert_query = "INSERT INTO fingerprints (fingerprint_data) VALUES (%s)"
            self.cursor.execute(insert_query, (finger_data,))
            self.db_connection.commit()

            messagebox.showinfo("Success", "Fingerprint data stored successfully.")
            print('Fingerprint data stored successfully.')
            self.label.config(text="Fingerprint data stored successfully.")

        except Exception as e:
            messagebox.showerror("Error", "An error occurred: " + str(e))

    def __del__(self):
        self.cursor.close()
        self.db_connection.close()

def main():
    root = tk.Tk()
    app = FingerprintGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()
