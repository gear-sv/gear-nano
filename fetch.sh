

if [ -z $TRANSACTION_ID ]; then
  echo "Please specify a valid Gear txid!"
  exit 1
fi

curl https://bico.media/$TRANSACTION_ID > gear-$TRANSACTION_ID.tar.gz

mkdir gear-$TRANSACTION_ID
tar -xvzf gear-$TRANSACTION_ID.tar.gz -C gear-$TRANSACTION_ID
rm gear-$TRANSACTION_ID.tar.gz
