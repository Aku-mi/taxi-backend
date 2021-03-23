import { Pool } from "pg";
import config from "../config/config";

const pool = new Pool({
  user: config.PSQL.USER,
  host: config.PSQL.HOST,
  database: config.PSQL.DATABASE,
  password: config.PSQL.PASSWORD,
  port: config.PSQL.PORT,
});

export const insert = async (
  lat: string,
  lng: string,
  tmp: string,
  uid: string
) => {
  const res = await pool.query(
    "INSERT INTO data (lat,lng,tmp,uid) VALUES ($1, $2, $3, $4)",
    [parseFloat(lat), parseFloat(lng), parseInt(tmp), uid]
  );
  return res.rows[0];
};

export const getAll = async () => {
  const res = await pool.query("SELECT * FROM data");
  return res.rows;
};

export const getById = async (id: string) => {
  const res = await pool.query("SELECT * FROM data WHERE id = $1", [
    parseInt(id),
  ]);
  return res.rows[0];
};

export const deleteById = async (id: string) => {
  const res = await pool.query("DELETE FROM data WHERE id = $1", [
    parseInt(id),
  ]);
  return res.rows[0];
};

export const getByUid = async (uid: string) => {
  const res = await pool.query("SELECT * FROM data WHERE uid = $1", [
    parseInt(uid),
  ]);
  return res.rows;
};

export const deleteByUid = async (uid: string) => {
  const res = await pool.query("DELETE FROM data WHERE uid = $1", [
    parseInt(uid),
  ]);
  return res.rows;
};
