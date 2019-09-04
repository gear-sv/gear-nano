
if [ -z $TRANSACTION_ID ]; then
 echo "Please specify a valid Gear txid!"
 exit 1
fi

curl https://bico.media/$TRANSACTION_ID > gear-$TRANSACTION_ID.tar.gz && \
CHECKSUM=$(md5sum gear-$TRANSACTION_ID.tar.gz) && \
tar -xvzf gear-$TRANSACTION_ID.tar.gz -C gear-$CHECKSUM


#rm gear-$TRANSACTION_ID.tar.gz

# echo OWNER=$(
# curl https://api.whatsonchain.com/v1/bsv/main/tx/hash/73cc7dd4937af750aa824f7b0f297e9fe7cca744379d08be74e738f7aa5d9afb | jq '.vout[1].scriptPubKey.addresses[0]')
