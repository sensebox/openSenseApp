##import sys, json
##
##def read_in():
##    lines = sys.stdin.readlines()
##    return json.loads(lines[0])
##
##def main():
##
##    lines = read_in()
##
####    # Sum  of all the items in the providen array
####    for item in lines:
####        for k,v in item.items():
####            y = k.encode('utf-8')
####            print type(y),y, "=>", type(v), v
##
####    for item in lines:
####        print item.keys()
####    x = item.keys()
####    print type(x[0])
####    print x
##
##    index = 1
##    for item in lines:
##        for key in sorted(item.iterkeys()):
##        #if(index > 770 and index < 780):
##            y = key.encode('utf-8')
##            print type(y),y, "=>", type(item[key]), item[key]
##        #index = index+1
##        print len(item)
##
### Start process
##if __name__ == '__main__':
##    main()



from pandas import Series
from statsmodels.tsa.arima_model import ARIMA
from sklearn.metrics import mean_squared_error
from math import sqrt
import numpy as np #delete it when finish the example
import sys #to get argument from js

def predict(coef, history):
	yhat = 0.0
	for i in range(1, len(coef)+1):
		yhat += coef[i-1] * history[-i]
	return yhat

t9am=np.array(
[[9.954666667, 10.89683333,13.61566667,8.7342,5.49804878,10.94830508,12.243,8.517966102,8.464,6.565833333], 
[12.61466667,12.78811321,14.63516667,16.52516667,7.829761905,12.39824561,12.52733333,10.2945,12.08466667,8.913],
[12.62853659,11.192,13.754,13.31041667,9.869636364,8.174259259,12.42616667,12.12146341,9.7775,10.05483333,6.707]])

i=0
while(i<3): 
	size = len(t9am[i])
	train = t9am[i][0:size]
	history = [x for x in train]
	predictions = list()
	for t in range(1):
		model = ARIMA(history, order=(1,0,0))
		model_fit = model.fit(trend='nc', disp=False)
		ar_coef = model_fit.arparams
		yhat = predict(ar_coef, history)
		predictions.append(yhat)
		obs = yhat
		history.append(obs)
		print('>predicted=%.3f' % (yhat))
	i=i+1
