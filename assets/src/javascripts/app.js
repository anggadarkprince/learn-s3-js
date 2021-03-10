const {S3, CreateBucketCommand} = require('@aws-sdk/client-s3');

const s3Client = new S3({
	endpoint: 'https://s3-id-jkt-1.kilatstorage.id/',
	region: 'us-east-1',
	credentials: {
		accessKeyId: '029564c0b1bc0f9d6cd7',
		secretAccessKey: 'GZXazo5E3laDlBegrINnXDs2qbaCHV+q2LH6MTmX',
	},
	http: {
		verify: false
	}
});

s3Client.putObject({Bucket : 'training-local', Key: 'album/' }, function(err, data) {
	console.log(err);
});

s3Client.send(new CreateBucketCommand({Bucket : 'test-bucket1'}), function(err, data) {
	console.log(err);
})

s3Client.createBucket({Bucket : 'test-bucket2'}, function(err, data) {
	console.log(err)
	if (err) {
		console.log("Error", err);
	} else {
		console.log("Success", data);
	}
})

s3Client.listObjects({Bucket: 'training-local'}, function (err, data) {
	if(err)throw err;
	console.log(data);
});

s3Client.getObject({Bucket: 'training-local', Key: 'lessons/2021/01/6000ffb4bb856.png'})
	.then(result => {
		console.log(result);
	})
	.catch(err => {
		console.log(err.message)
	});

document.getElementById('form-upload').addEventListener('submit', function(e) {
	e.preventDefault();

	const files = document.getElementById('input-file').files;

	if (!files.length) {
		return alert("Please choose a file to upload first.");
	}
	const file = files[0];
	const fileName = Math.random().toString(36).substring(7) + '-' + file.name;
	const fileKey = 'temp/' + fileName;

	s3Client.putObject({
		Bucket: 'training-local',
		Key: fileKey,
		Body: file
	})
		.then(result => {
			console.log(result);
		})
		.catch(console.log);
});