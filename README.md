

# Electronic Vote (evote)

## Get started

1) Clone repository<br/>
`git clone https://github.com/UNSA-OUIS/elecciones-virtuales.git`

2) Change directory<br/>
`cd elecciones-virtuales`

3) Install dependencies<br/>
`npm install`

All set!!!

## Run App

* `npm start`

## Configuration Development Database using Heroku 

* Host `ec2-52-71-55-81.compute-1.amazonaws.com`
* Database `daitvf87a4l2mq`
* User `nnezeqdygiubyg`
* Port `5432`
* Password `e3f61d1aeff561d1c4019d473d2bbd007fe0e097d62c6a5844383acdb796713a`

## Update models from database 
1) Restore the development database in local with the name evote <br/>
2) In the project directory run this code:<br/>
* `npx sequelize-auto -h localhost -d evote -u postgres -x 'your_password' -p 5432 -e postgres`
3) To restore an specific model from a table:<br/>
* `npx sequelize-auto -h localhost -d evote -t 'table_name' -u postgres -x 'your_password' -p 5432 -e postgres`

## Developing in evote.unsa.edu.pe

```bash
https://github.com/UNSA-OUIS/elecciones-virtuales
cd elecciones-virtuales
npm install
npm audit fix
pm2 start ./bin/www # start the app in background
pm2 list # to retrieve its ID
pm2 stop ID 
pm2 delete ID 
```

## Running in production

1. `NODE_ENV` must be set from 'development' to 'production'

## Troubleshooting

```bash
npm cache clean --force
rm -rf node_modules
npm install
npm start
```

