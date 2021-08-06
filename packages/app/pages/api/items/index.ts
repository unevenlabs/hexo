import { NextApiRequest, NextApiResponse } from 'next'
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
      let items = [];
      fs.createReadStream(path.resolve(__dirname, '../../public', 'gen1.csv'))
      .pipe(csv.parse({ headers: true }))
      .on('error', error => console.error(error))
      .on('data', row => items.push(row))
      .on('end', (rowCount: number) => res.status(200).json(items));
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
