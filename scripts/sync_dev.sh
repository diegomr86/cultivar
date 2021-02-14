APP="cultivar"
echo "Synchronizing uploads folder..."
curl https://terrakrya.s3.us-west-002.backblazeb2.com/$APP/uploads/$APP-uploads.zip --output $APP-uploads.zip
unzip -o $APP-uploads.zip -d uploads/
rm $APP-uploads.zip
echo "Synchronizing database..."
curl https://terrakrya.s3.us-west-002.backblazeb2.com/$APP/dumps/$APP-latest.zip --output $APP-latest.zip
mongorestore --archive=$APP-latest.zip --gzip --db $APP --drop
rm $APP-latest.zip
echo "Sync finished with success \o/"
