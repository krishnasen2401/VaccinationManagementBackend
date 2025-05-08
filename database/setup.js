const Database = require('better-sqlite3');

const DB_PATH = './database/vaccination_data.db';

try {
    const db = new Database(DB_PATH);

    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    db.pragma('cache_size = -20000');
    db.pragma('foreign_keys = ON');

    const createUsersTableSQL = `
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            token TEXT,
            contact TEXT,
            roles TEXT
        );
    `;

    const createClassesTableSQL = `
        CREATE TABLE IF NOT EXISTS classes (
            class_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            section TEXT
        );
    `;

    const createStudentsTableSQL = `
        CREATE TABLE IF NOT EXISTS students (
            student_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            class_id TEXT,
            date_of_birth TEXT,
            guardians TEXT,
            FOREIGN KEY (class_id) REFERENCES classes(class_id)
        );
    `;

    const createVaccinesTableSQL = `
        CREATE TABLE IF NOT EXISTS vaccines (
            vaccine_id TEXT PRIMARY KEY,
            vaccine_name TEXT NOT NULL,
            manufacturer TEXT,
            dosage TEXT,
            description TEXT,
            storage_requirements TEXT,
            batches TEXT,
            doses_per_vial INTEGER,
            vaccine_type TEXT,
            administer_before TEXT,
            country_of_origin TEXT,
            package_insert TEXT,
            numberOfVials INTEGER
        );
    `;

    const createVaccinationDrivesTableSQL = `
        CREATE TABLE IF NOT EXISTS vaccination_drives (
            drive_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            created_by TEXT,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            location TEXT,
            target_classes TEXT,
            notes TEXT,
            status TEXT,
            vaccines TEXT,
            FOREIGN KEY (created_by) REFERENCES users(user_id)
        );
    `;

    const createVaccinationRecordsTableSQL = `
        CREATE TABLE IF NOT EXISTS vaccination_records (
            record_id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL,
            date TEXT NOT NULL,
            drive_id TEXT,
            vaccine_id TEXT NOT NULL,
            administered_by TEXT,
            batch_id TEXT,
            notes TEXT,
            FOREIGN KEY (student_id) REFERENCES students(student_id),
            FOREIGN KEY (drive_id) REFERENCES vaccination_drives(drive_id),
            FOREIGN KEY (vaccine_id) REFERENCES vaccines(vaccine_id),
            FOREIGN KEY (administered_by) REFERENCES users(user_id)
        );
    `;

    db.exec(createUsersTableSQL);
    console.log('Users table created or already exists.');

    db.exec(createClassesTableSQL);
    console.log('Classes table created or already exists.');

    db.exec(createStudentsTableSQL);
    console.log('Students table created or already exists.');

    db.exec(createVaccinesTableSQL);
    console.log('Vaccines table created or already exists.');

    db.exec(createVaccinationDrivesTableSQL);
    console.log('VaccinationDrives table created or already exists.');

    db.exec(createVaccinationRecordsTableSQL);
    console.log('VaccinationRecords table created or already exists.');

    console.log('Database setup complete.');

    db.close();
    console.log('Closed the database connection.');

} catch (err) {
    console.error('Error during database setup:', err.message);
}
