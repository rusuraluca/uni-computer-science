x=0:0.01:3;

subplot(2,2,1)
y1=x.^5/10;
plot(x, y1)
title('Subplot 1: (x^5)/10')

subplot(2,2,2)
y2=x.*sin(x);
plot(x,y2)
title('Subplot 2: x*sin(x)')

subplot(2,2,3)
y3=cos(x);
plot(x,y3)
title('Subplot 3: cos(x)')
