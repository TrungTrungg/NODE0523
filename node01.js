let arrImage = [
    {
      "id": 1,
      "name": "Animal Funny 1",
      "like": 100,
      "dislike": 5,
      "love": 50
    },
    {
      "id": 2,
      "name": "Animal Funny 2",
      "like": 200,
      "dislike": 15,
      "love": 129
    },
    {
      "id": 3,
      "name": "Animal Funny 3",
      "like": 100,
      "dislike": 42,
      "love": 10
    },
    {
      "id": 4,
      "name": "Animal Funny 4",
      "like": 100,
      "dislike": 22,
      "love": 44
    },
    {
      "id": 5,
      "name": "Animal Funny 4",
      "like": 154,
      "dislike": 22,
      "love": 144
    },
    {
      "id": 6,
      "name": "Animal Funny 6",
      "like": 88,
      "dislike": 45,
      "love": 56
    },
    {
      "id": 7,
      "name": "Animal Funny 7",
      "like": 100,
      "dislike": 43,
      "love": 44
    },
    {
      "id": 8,
      "name": "Animal Funny 8",
      "like": 333,
      "dislike": 45,
      "love": 280
    },
    {
      "id": 9,
      "name": "Animal Funny 9",
      "like": 145,
      "dislike": 33,
      "love": 120
    },
    {
      "id": 10,
      "name": "Animal Funny 10",
      "like": 66,
      "dislike": 44,
      "love": 44
    }
]
let newArr = []
//  Câu 1
arrImage.forEach(img => {if(img.like !== 100) 
    newArr.push(img)})
// câu 2
const newArrImg = arrImage.sort((a,b) => a-b)

// câu 3
const productName = arrImage.forEach(img => {if(img.like >= 100 && img.love >= 100) console.log(img.name)})

// Câu 4

arrImage.forEach(img => {if(img.like >= 300) img.type = 'Loại A'
if(img.like >= 200 && img.like<=300) img.type = 'Loại B'
if(img.like>=100 && img.like <=200) img.type ='Loại C'
if(img.like <= 100) img.type = 'Loại D'})

const count = (like, love, dislike) => { 
    let countLike = 0
    let countLove = 0
    let countDislike = 0

    arrImage.forEach( img => {
        if(img.like === like){
            countLike +=1
        } 
        if(img.love === love){
            countLove +=1
        } 
        if(img.dislike === dislike){
            countDislike +=1
        } 
    })

    return `Bạn có ${countLike} hình ảnh có lượt like là: ${like}, Bạn có ${countLove} hình ảnh có lượt like là: ${love}, Bạn có ${countDislike} hình ảnh có lượt like là: ${dislike},`
    
 }

console.log(count(66,44,44));
