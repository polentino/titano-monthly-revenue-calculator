# The Math Behind

[1. Intro](#intro)

[2. Compound Interest Formula](#compound-interest-formula)

[2.1 I tried the same formula in TITANO website, and the numbers are different](#i-tried-the-same-formula-in-titano-website-and-the-numbers-are-different)

[3  It's All About Finding The Right Date](#its-all-about-finding-the-right-date)

[3.1  Extending the formula: Fees and Taxes](#extending-the-formula-fees-and-taxes)

[3.2  A Note On Taxes](#a-note-on-taxes)

## Intro

If you're reading this, it means you're interested in understanding how the whole
"sustainable" TITANO calculation actually works. You're in the right place, and it's also really simple to understand.

However, I can't stress this enough: all of those considerations described here hold true **if, and only if, TITANO
price remains stable**.

Without further ado, let's get started :tada:

## Compound Interest Formula

As described in [Investopedia](https://www.investopedia.com/terms/c/compoundinterest.asp), the compound interest is
defined like so:

<img src="https://render.githubusercontent.com/render/math?math=CI%20=%20P%5B(1%2Bi)%5En-1%5D#gh-light-mode-only">
<img src="https://render.githubusercontent.com/render/math?math={\color{white}CI%20=%20P%5B(1%2Bi)%5En-1%5D}#gh-dark-mode-only">

Where:

* `P` is your initial (principal) capital
* `i` is the interest at every compounding period
* `n` is the number of compounding periods

As per TITANO's docs, namely [FAQ 7 – When does the Rebase occur?](https://docs.titano.finance/guide/f.a.q.), the %
interest every 30 minutes amounts to 0.03958%, which translates to a `n=0.0003958`.

Say you have 1000 TITANO in your wallet, and let them compound for a year, how much TITANO will you accrue? The answer
is:

<img src="https://render.githubusercontent.com/render/math?math=CI%20=%20P%5B(1%2B0.0003958)%5E%7B365*24*2%7D-1%5D%20=%201024611.235#gh-light-mode-only">
<img src="https://render.githubusercontent.com/render/math?math={\color{white}CI%20=%20P%5B(1%2B0.0003958)%5E%7B365*24*2%7D-1%5D%20=%201024611.235}#gh-dark-mode-only">

Of course, that's your *compound interest*; to get the whole amount in your wallet, you'd still need to sum your initial
capital, that is, 1000 TITANO. But by now, you should have understood the power of compound interest.

### I tried the same formula in TITANO website, and the numbers are different

I am pretty sure that, at the end of the previous paragraph, you visited
[TITANO's calculator](https://app.titano.finance/#/calculator) and tried some numbers by yourself. Perhaps you used my
very same initial capital, `1000`, and got surprised when you realized their prediction was slightly off: in fact, their
website shows a rewards estimation of `962546.24`, while mine is of `1024611.235` ... what's going on here?

Well, I believe TITANO's calculator has some bugs in it. The reason I say so is that,
[if you try the compound formula directly on google](https://www.google.com/search?q=1000+*+%28%281%2B0.0003958%29%5E%28365*24*2%29-1%29)
, you will get my very same result. You can even modify the parameters as you deem fit, if you want more realistic
numbers.

Great! By now, you have a basic understanding of how compound interest works, and that it grows exponentially. You might
be tempted to use the *buy and hold* strategy but let's face it, it's risky. A more responsible approach, the one I use,
is taking profits on a regular basis. Furthermore, as you probably saw in my calculator, our TITANO wallet will still
grow over time (albeit slower than if you were to never take profits).

We will see how that works in the next paragraph.

## It's All About Finding The Right Date

Let's start with an example. **For sake of simplicity, let's assume 1 TITANO = 1 USD**, and that your wallet contains
1000 TITANO. You, being a responsible investor, would like to take regular profits every week for 500 USD, which means
500 TITANO. You will soon realize that:

* if you start today and exchange 500 TITANO back right away (I know, nobody will ever buy TITANO and then swap them
  back the same day but stay with me, it's the overall idea that matters), your TITANO wallet will now have 500 TITANO
  left: this will be your initial capital. Next week, if you use the compound formula above, you'll realize your wallet
  has in total 571 TITANO. You could take profit again for 500 USD as you originally wanted but then, with only 71
  TITANO in your wallet, it would take a lot more than a week before you'd be able to withdraw 500 TITANO again.
* however, if you don't touch your wallet for 77 days: using the formula above, the 77th day your interests will amount
  to 3317 TITANO, for a total of 4317 TITANO. Since you want to withdraw 500 TITANO, your new initial capital will be
  3817 TITANO which, the week after, will yield a compound interest of 542 TITANO. This is still good because the grand
  total in your wallet will be 4359 TITANO. You can withdraw again 500 TITANO and your new initial capital will be 3859
  TITANO. Since it's higher than the previous week's initial capital (3817 TITANO), you will have not only enough "
  critical TITANO mass" to sustain a weekly 500 TITANO withdrawal but also, more importantly, **your wallet will keep
  increasing over time**.

As you may have guessed by now, it's all about finding the day when you'll have sufficient TITANO in your wallet to
sustain a weekly/monthly withdrawal. How can we do that?

Well, we can approximate this (we'll see soon why this approximation comes in handy) and say, using the same example:

> since I want to withdraw 500 TITANO, every week, it means that *on average* every compounding period will
> have to yield 500 / (7 * 24 * 2) = 1.4881 TITANO

and now we can calculate on which day the compounding formula will hit that magical `1.4881` number. From that
compounding period onwards, we are **guaranteed** to generate at least `1.4881` TITANO because, remember, it's not a
real average!

In reality, since it's a compound interest, it will be greater than 500 TITANO which is good for two reasons:

1. if the price drops, we will need to withdraw more TITANO than expected, so there's some leeway built in already
2. if the price doesn't drop or, even better, decreases, there will be more TITANO left in the wallet, which will yield
   a higher interest in the next compounding period

So, generalizing a bit: how do we compute that magic compounding period `n` that will produce the desired average TITANO
interest over one compounding period? Well, we need to find the correct `n` for which the compound interest at `n+1`
minus the compound interest at period `n` is equal to that amount. In math terms:

<img src="https://render.githubusercontent.com/render/math?math=AVG_%7BTITANO%7D%20=%20CI_%7Bn%2B1%7D-CI_%7Bn%7D#gh-light-mode-only">
<img src="https://render.githubusercontent.com/render/math?math={\color{white}AVG_%7BTITANO%7D%20=%20CI_%7Bn%2B1%7D-CI_%7Bn%7D}#gh-dark-mode-only">

and if substitute the compounding formula

<img src="https://render.githubusercontent.com/render/math?math=AVG_%7BTITANO%7D%20=%20P%5B(1%2B0.0003958)%5E%7Bn%2B1%7D-1%5D-P%5B(1%2B0.0003958)%5E%7Bn%7D-1%5D#gh-light-mode-only">
<img src="https://render.githubusercontent.com/render/math?math={\color{white}AVG_%7BTITANO%7D%20=%20P%5B(1%2B0.0003958)%5E%7Bn%2B1%7D-1%5D-P%5B(1%2B0.0003958)%5E%7Bn%7D-1%5D}#gh-dark-mode-only">

which can be simplified to

<img src="https://render.githubusercontent.com/render/math?math=AVG_%7BTITANO%7D%20=%20P*1.0003958%5E%7Bn%2B1%7D-P*1.0003958%5E%7Bn%7D#gh-light-mode-only">
<img src="https://render.githubusercontent.com/render/math?math={\color{white}AVG_%7BTITANO%7D%20=%20P*1.0003958%5E%7Bn%2B1%7D-P*1.0003958%5E%7Bn%7D}#gh-dark-mode-only">

and then again

<img src="https://render.githubusercontent.com/render/math?math=AVG_%7BTITANO%7D%20=%20P*1.0003958%5En*(1.0003958-1)#gh-light-mode-only">
<img src="https://render.githubusercontent.com/render/math?math={\color{white}AVG_%7BTITANO%7D%20=%20P*1.0003958%5En*(1.0003958-1)}#gh-dark-mode-only">

and finally into

<img src="https://render.githubusercontent.com/render/math?math=AVG_%7BTITANO%7D%20=%20P*1.0003958%5En*0.0003958#gh-light-mode-only">
<img src="https://render.githubusercontent.com/render/math?math={\color{white}AVG_%7BTITANO%7D%20=%20P*1.0003958%5En*0.0003958}#gh-dark-mode-only">

by rearranging both sides of the equation, you'll get

<img src="https://render.githubusercontent.com/render/math?math=1.0003958%5En=%5Cfrac%7BAVG_%7BTITANO%7D%7D%7BP*0.0003958%7D#gh-light-mode-only">
<img src="https://render.githubusercontent.com/render/math?math={\color{white}1.0003958%5En=%5Cfrac%7BAVG_%7BTITANO%7D%7D%7BP*0.0003958%7D}#gh-dark-mode-only">

and now we're just one logarithm away from the result:

<img src="https://render.githubusercontent.com/render/math?math=n=%5Cfrac%7Blog_%7B10%7D%5Cleft%20(%20%5Cfrac%7BAVG_%7BTITANO%7D%7D%7BP*0.0003958%7D%20%5Cright%20)%7D%7Blog_%7B10%7D1.0003958%7D#gh-light-mode-only">
<img src="https://render.githubusercontent.com/render/math?math={\color{white}n=%5Cfrac%7Blog_%7B10%7D%5Cleft%20(%20%5Cfrac%7BAVG_%7BTITANO%7D%7D%7BP*0.0003958%7D%20%5Cright%20)%7D%7Blog_%7B10%7D1.0003958%7D}#gh-dark-mode-only">

And there, you have it!

Proof: if you substitute the average TITANO of the example of this paragraph, you will get `n=3346.66` which are about
about 70 days (actually 69.72). Therefore, after 70 days, we will start accumulating enough "critical TITANO mass" which
will allow us to withdraw the desired 500 TITANO one week later (and the next one, and the next after that, etc ...),
which means, on the 77th day, we can start withdrawing them :white_check_mark:

### Extending The Formula: Fees and Taxes

Now that you know how the average TITANO and the optimal compounding interval `n` are related to each other, you can
extend the formula to include slippage fees and taxes. For example, if

* slippage is 20%
* I have to pay 30% taxes every time I withdraw

using the same values in my example at the beginning of the paragraph, assuming I want to withdraw 500 USD (500 TITANO
equiv.)
**after taxes**, it means that the actual TITANO that will leave my wallet, every week, will be

> (500/(1-0.3))/(1-0.2) = 892.857 TITANO

Therefore, the new average TITANO per compounding period will be

> 892.857 / (7 * 24 * 2) = 2.6573 TITANO

and the new compounding period will be `n=4812`, or about 101 days. Thus, the profit-taking will commence on day 108 :
white_check_mark:

### A Note On Taxes

I'm sorry but, with almost 200 countries in the world, there's no way I can create the perfect calculator that fits for
everybody's tax system. That's really beyond my reach.

With this cleared out: my calculator uses the `taxes` field to compute taxes every time you withdraw, that is, either
monthly or weekly. It's up to you to get to know your taxation system and insert a sensible value for it. Or just leave
set it to `0`, and then your tax accountant will tell you how much of it will have to be paid.
