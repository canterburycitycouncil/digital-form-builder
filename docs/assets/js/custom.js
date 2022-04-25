document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('.navigation .navigation-list .navigation-list-item');
    links.forEach(function(link) {
        if(link.children.length > 1){
            link.addEventListener('mouseenter', event => {
                for (let child of link.children){
                    if(child.classList.contains('navigation-dropdown') && child.classList.contains('hidden')){
                        console.log('removing class');
                        child.classList.remove('hidden');
                        child.addEventListener('mouseenter', enterEvent => {
                            child.addEventListener('mouseleave', leaveEvent => {
                                console.log('adding class');
                                child.classList.add('hidden');
                            })
                        });
                    }
                }
            })
        }
    })
})

function hasChildren(link) {

}