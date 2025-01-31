import sqlite3

# Connect to the database
conn = sqlite3.connect('storyapp.db')  # Adjust the path if necessary
cursor = conn.cursor()

# Query to list all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print('jkl')
# Print all table names
for table in tables:
    print(table[0])

# Close the connection
conn.close()
