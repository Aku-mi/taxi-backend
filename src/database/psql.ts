import { Pool } from "pg";
import config from "../config/config";

const poolOptions = {
  user: config.PSQL.USER,
  host: config.PSQL.HOST,
  database: config.PSQL.DATABASE,
  password: config.PSQL.PASSWORD,
  port: config.PSQL.PORT,
};

export const insert = async (
  lat: number,
  lng: number,
  tmp: number,
  uid: string,
  rpm: number,
  speed: number
) => {
  const pool = new Pool(poolOptions);

  const res = await pool.query(
    "INSERT INTO data(lat,lng,tmp,uid,rpm,speed) VALUES($1, $2, $3, $4, $5, $6)",
    [lat, lng, tmp, uid, rpm, speed]
  );
  pool.end();
  return res.rows;
};

export const getAll = async () => {
  const pool = new Pool(poolOptions);

  const res = await pool.query("SELECT * FROM data");
  pool.end();
  return res.rows;
};

export const getLastOneByUid = async (uid: string) => {
  const pool = new Pool(poolOptions);

  const res = await pool.query(
    "SELECT * FROM data WHERE uid = $1 ORDER BY tmp DESC LIMIT 1",
    [uid]
  );
  pool.end();
  return res.rows[0];
};

export const getByUid = async (uid: string) => {
  const pool = new Pool(poolOptions);

  const res = await pool.query("SELECT * FROM data WHERE uid = $1", [uid]);
  pool.end();
  return res.rows;
};

export const deleteByUid = async (uid: string) => {
  const pool = new Pool(poolOptions);

  const res = await pool.query("DELETE FROM data WHERE uid = $1", [uid]);
  pool.end();
  return res.rows;
};

export const timeSetByUid = async (uid: string, tmp1: number, tmp2: number) => {
  const pool = new Pool(poolOptions);

  const res = await pool.query(
    "SELECT * FROM data WHERE uid = $1 AND tmp > $2 AND tmp < $3",
    [uid, tmp1, tmp2]
  );
  pool.end();
  return res.rows;
};

export const areaSetByUid = async (
  uid: string,
  tmp1: number,
  tmp2: number,
  lat: number,
  lng: number
) => {
  const pool = new Pool(poolOptions);

  const res = await pool.query(
    "SELECT * FROM data WHERE tmp > $2 AND tmp < $3 AND uid = $1 AND (lat - ($4))*(lat - ($4)) + (lng - ($5))*(lng - ($5)) < 0.01",
    [uid, tmp1, tmp2, lat, lng]
  );
  pool.end();
  return res.rows;
};

export const chartSetByUid = async (
  uid: string,
  tmp1: number,
  tmp2: number
) => {
  const pool = new Pool(poolOptions);

  const res = await pool.query(
    "SELECT rpm,speed,tmp FROM data WHERE uid = $1 AND tmp > $2 AND tmp < $3 AND rpm IS NOT NULL AND speed IS NOT NULL",
    [uid, tmp1, tmp2]
  );
  pool.end();
  return res.rows;
};

export const chartSetAll = async (tmp1: number, tmp2: number) => {
  const pool = new Pool(poolOptions);

  const res = await pool.query(
    "SELECT AVG(rpm) AS rpmA,AVG(speed) AS speedA FROM data WHERE tmp > $1 AND tmp < $2 AND rpm IS NOT NULL AND speed IS NOT NULL",
    [tmp1, tmp2]
  );
  pool.end();
  return res.rows;
};
