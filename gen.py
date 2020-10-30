import random
template = "insert into seats (s_id,seat_price,theater_id) values ({},{},{});"

t = {}
t[0] = 25
t[1] = 49
t[2] = 49
t[3] = 25
t[4] = 49
t[5] = 25
t[6] = 25
t[7] = 49
t[8] = 49
t[9] = 25

k= 1

for i in range(0,10):
	for j in range(k,k+t[i]):
		sp = 50*random.randint(0,1)
		print(template.format(k,sp,i+1))
		k = k+1

